import type { AppError, ApiResponse } from '@/types';

export class ApiError extends Error implements AppError {
  code?: string;
  status?: number;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    options: {
      code?: string;
      status?: number;
      details?: Record<string, unknown>;
      cause?: Error;
    } = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
    this.cause = options.cause;
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, { cause: error });
  }

  if (typeof error === 'string') {
    return new ApiError(error);
  }

  return new ApiError('알 수 없는 오류가 발생했습니다.');
};

export const isApiResponse = <T>(data: unknown): data is ApiResponse<T> => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    typeof (data as any).success === 'boolean'
  );
};

export const validateApiResponse = <T>(
  response: unknown,
  endpoint: string
): ApiResponse<T> => {
  if (!isApiResponse<T>(response)) {
    throw new ApiError(`Invalid API response from ${endpoint}`, {
      code: 'INVALID_RESPONSE',
      details: { response },
    });
  }

  if (!response.success) {
    throw new ApiError(
      response.message || response.error || `API 요청 실패: ${endpoint}`,
      {
        code: 'API_ERROR',
        details: { endpoint, response },
      }
    );
  }

  return response;
};

export const createApiUrl = (
  baseUrl: string,
  endpoint: string,
  params?: Record<string, string | number | boolean>
): string => {
  const url = new URL(endpoint, baseUrl);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  
  return url.toString();
};

export const getAuthHeaders = (token?: string | null): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const retry = async <T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    backoff?: boolean;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      const currentDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      await sleep(currentDelay);
    }
  }

  throw lastError;
};