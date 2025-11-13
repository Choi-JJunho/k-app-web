import { useApi } from './useApi';
import { apiClient, type Meal } from '@/lib/api';
import { formatDate } from '@/utils/date';
import type { ApiResponse } from '@/types';

interface UseMealsOptions {
  enabled?: boolean;
  staleTime?: number;
}

/**
 * Fetches meals data for a given date
 * @param date - Date string (YYYY-MM-DD) or Date object
 * @param options - Optional configuration for the API call
 * @returns Object with data (Meal[]), isLoading, error, and refetch function
 */
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
