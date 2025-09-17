import { ApiError, handleApiError, validateApiResponse, getAuthHeaders, retry } from '@/utils/api';
import type { ApiResponse } from '@/types';

interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
}

export class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ''); // trailing slash 제거
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  private saveTokensToStorage(token: string, refreshToken?: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
    }
  }

  private clearTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  }

  setTokens(token: string | null, refreshToken?: string | null): void {
    this.token = token;
    this.refreshToken = refreshToken || null;

    if (token) {
      this.saveTokensToStorage(token, refreshToken || undefined);
    } else {
      this.clearTokensFromStorage();
    }
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken) {
      throw new ApiError('Refresh token not available', { code: 'NO_REFRESH_TOKEN' });
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;
      this.isRefreshing = false;
      this.refreshPromise = null;
      return newToken;
    } catch (error) {
      this.isRefreshing = false;
      this.refreshPromise = null;
      this.clearTokensFromStorage();
      throw error;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    if (!response.ok) {
      throw new ApiError('Token refresh failed', { 
        status: response.status,
        code: 'TOKEN_REFRESH_FAILED' 
      });
    }

    const data = await response.json();
    const newToken = data.data?.token || data.token;
    
    if (!newToken) {
      throw new ApiError('Invalid refresh response', { code: 'INVALID_REFRESH_RESPONSE' });
    }

    this.setTokens(newToken, this.refreshToken);
    return newToken;
  }

  private createTimeoutSignal(timeoutMs: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeoutMs);
    return controller.signal;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = 10000,
      retries = 0,
      skipAuth = false,
      ...requestInit
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      ...getAuthHeaders(skipAuth ? null : this.token),
      ...requestInit.headers,
    };

    const requestOptions: RequestInit = {
      ...requestInit,
      headers,
      signal: this.createTimeoutSignal(timeout),
    };

    const makeRequest = async (): Promise<ApiResponse<T>> => {
      try {
        const response = await fetch(url, requestOptions);
        
        // 401 Unauthorized인 경우 토큰 갱신 시도
        if (response.status === 401 && !skipAuth && this.refreshToken) {
          try {
            await this.refreshAccessToken();
            // 새로운 토큰으로 재시도
            const retryHeaders = {
              ...headers,
              Authorization: `Bearer ${this.token}`,
            };
            const retryResponse = await fetch(url, {
              ...requestOptions,
              headers: retryHeaders,
            });
            
            if (!retryResponse.ok) {
              throw new ApiError(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`, {
                status: retryResponse.status,
                code: 'HTTP_ERROR',
              });
            }
            
            const retryData = await retryResponse.json();
            return validateApiResponse<T>(retryData, endpoint);
          } catch (refreshError) {
            // 토큰 갱신 실패시 원래 응답 처리
            throw new ApiError('Authentication failed', {
              status: 401,
              code: 'AUTH_FAILED',
              cause: refreshError instanceof Error ? refreshError : undefined,
            });
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`,
            {
              status: response.status,
              code: 'HTTP_ERROR',
              details: errorData,
            }
          );
        }

        const data = await response.json();
        return validateApiResponse<T>(data, endpoint);
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof DOMException && error.name === 'AbortError') {
          throw new ApiError(`Request timeout (${timeout}ms)`, {
            code: 'TIMEOUT',
            details: { endpoint, timeout },
          });
        }

        throw handleApiError(error);
      }
    };

    if (retries > 0) {
      return retry(makeRequest, {
        maxAttempts: retries + 1,
        delay: 1000,
        shouldRetry: (error) => {
          if (error instanceof ApiError) {
            // 4xx 클라이언트 오류는 재시도하지 않음
            return !error.status || error.status >= 500;
          }
          return true;
        },
      });
    }

    return makeRequest();
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // 파일 업로드를 위한 특별한 메서드
  async upload<T>(
    endpoint: string,
    formData: FormData,
    config?: Omit<RequestConfig, 'headers'>
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {};
    
    if (!config?.skipAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: formData,
      headers,
    });
  }
}

// 환경변수에서 API Base URL 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// 전역 API 클라이언트 인스턴스
export const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;