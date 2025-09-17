import { useApi } from './useApi';
import { apiClient, type Meal } from '@/lib/api';
import { formatDate } from '@/utils/date';
import type { ApiResponse } from '@/types';

interface UseMealsOptions {
  enabled?: boolean;
  staleTime?: number;
}

export function useMeals(date: string | Date, options: UseMealsOptions = {}) {
  const formattedDate = typeof date === 'string' ? date : formatDate(date);
  
  return useApi<Meal[]>(
    (): Promise<ApiResponse<Meal[]>> => apiClient.get<Meal[]>(`/meals?date=${formattedDate}`),
    {
      enabled: !!formattedDate && (options.enabled ?? true),
      staleTime: options.staleTime ?? 5 * 60 * 1000, // 5분
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      retries: 2,
    }
  );
}

// 호환성을 위한 레거시 인터페이스
interface UseMealsReturn {
  meals: Meal[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMealsLegacy(date: string): UseMealsReturn {
  const { data, isLoading, error, refetch } = useMeals(date);
  
  return {
    meals: data || [],
    loading: isLoading,
    error,
    refetch,
  };
}
