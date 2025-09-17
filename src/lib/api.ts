// 개선된 API 클라이언트를 위한 재내보내기
export { apiClient } from './apiClient';

// 타입 정의 재내보내기 (호환성을 위해)
export type {
  ApiResponse,
  User,
  LoginCredentials as LoginRequest,
  LoginResponse,
  RegisterData as RegisterRequest,
  Meal,
  NutritionData,
  MealTimeType,
} from '@/types';

// API 함수들 (개선된 버전)
import type { LoginCredentials, LoginResponse, RegisterData, User, Meal, NutritionData } from '@/types';

export const authApi = {
  // 로그인
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      // 토큰 저장
      apiClient.setTokens(response.data.token);
      return response.data;
    }
    throw new Error(response.message || '로그인 실패');
  },

  // 회원가입
  async register(userData: RegisterData): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', userData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '회원가입 실패');
  },

  // 로그아웃
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('로그아웃 API 호출 실패:', error);
    } finally {
      apiClient.setTokens(null);
    }
  },

  // 현재 사용자 정보 조회
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '사용자 정보 조회 실패');
  },
};

export const mealApi = {
  // 특정 날짜의 식단 조회
  async getMealsByDate(date: string): Promise<Meal[]> {
    const response = await apiClient.get<Meal[]>(`/meals?date=${date}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '식단 정보 조회 실패');
  },

  // 식단 즐겨찾기 추가/제거
  async toggleFavorite(mealId: string): Promise<void> {
    const response = await apiClient.post(`/meals/${mealId}/favorite`);
    if (!response.success) {
      throw new Error(response.message || '즐겨찾기 처리 실패');
    }
  },
};

export const nutritionApi = {
  // 영양정보 조회 (기간별)
  async getNutritionData(startDate: string, endDate: string): Promise<NutritionData[]> {
    const response = await apiClient.get<NutritionData[]>(
      `/nutrition?start_date=${startDate}&end_date=${endDate}`
    );
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || '영양정보 조회 실패');
  },
};