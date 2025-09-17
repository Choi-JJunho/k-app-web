// 기본 API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 에러 타입 정의
export interface AppError extends Error {
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

// 사용자 관련 타입
export interface User {
  readonly id: string;
  email: string;
  name: string;
  studentId: string;
  department: string;
  avatar: string;
  readonly createdAt: string;
  readonly updatedAt?: string;
}

// 인증 관련 타입
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  studentId: string;
  department: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// 식단 관련 타입
export type MealTimeType = 'breakfast' | 'lunch' | 'dinner';

export interface Meal {
  readonly id: string;
  date: string;
  dining_time: MealTimeType;
  menu: readonly string[];
  kcal: string;
  price: string;
  place: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface MealFilter {
  date?: string;
  mealTime?: MealTimeType | 'all';
  place?: string;
}

// 영양정보 관련 타입
export interface NutrientInfo {
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
}

export interface MealCalories {
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface NutritionData {
  readonly date: string;
  totalCalories: number;
  meals: MealCalories;
  nutrients: NutrientInfo;
}

export interface NutritionQueryParams {
  startDate: string;
  endDate: string;
  userId?: string;
}

// UI 상태 관련 타입
export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface ErrorState {
  error: string | null;
  errorCode?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// API 훅 반환 타입
export interface UseApiReturn<T> extends LoadingState, ErrorState {
  data: T | null;
  refetch: () => void;
  reset: () => void;
}

export interface UseMutationReturn<TData, TVariables> extends LoadingState, ErrorState {
  mutate: (variables: TVariables) => Promise<TData>;
  data: TData | null;
  reset: () => void;
}

// 폼 관련 타입
export interface FormFieldError {
  message: string;
  type: 'required' | 'pattern' | 'minLength' | 'maxLength' | 'custom';
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, FormFieldError>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
}

// 컴포넌트 Props 타입
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface AsyncComponentProps extends BaseComponentProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

// 라우팅 관련 타입
export type RouteParams = Record<string, string>;

export interface NavigationItem {
  path: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  requiredAuth?: boolean;
}

// 환경설정 타입
export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'production' | 'test';
  version: string;
  features: {
    enableOfflineMode: boolean;
    enableAnalytics: boolean;
    enablePushNotifications: boolean;
  };
}

// 유틸리티 타입
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 상수 타입
export const MEAL_TIMES = ['breakfast', 'lunch', 'dinner'] as const;
export const USER_ROLES = ['student', 'admin'] as const;
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },
  meals: {
    list: '/meals',
    byDate: (date: string) => `/meals?date=${date}`,
    favorite: (id: string) => `/meals/${id}/favorite`,
  },
  nutrition: {
    data: '/nutrition',
    byPeriod: (startDate: string, endDate: string) => 
      `/nutrition?start_date=${startDate}&end_date=${endDate}`,
  },
} as const;

export type UserRole = typeof USER_ROLES[number];
export type ApiEndpoint = typeof API_ENDPOINTS;