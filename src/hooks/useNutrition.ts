import { useApi } from './useApi';
import { apiClient, type NutritionData } from '@/lib/api';
import { formatDate } from '@/utils/date';
import type { ApiResponse } from '@/types';

interface UseNutritionOptions {
  period?: 'week' | 'month';
  enabled?: boolean;
}

/**
 * Fetches nutrition data for a given period
 * @param options - Optional configuration for the API call
 * @returns Object with data (NutritionData[]), isLoading, error, and refetch function
 */
export function useNutrition(options: UseNutritionOptions = {}) {
  const { period = 'week', enabled = true } = options;

  // Calculate date range based on period
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();

    if (period === 'week') {
      startDate.setDate(endDate.getDate() - 7);
    } else {
      startDate.setDate(endDate.getDate() - 30);
    }

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  const { startDate, endDate } = getDateRange();

  return useApi<NutritionData[]>(
    (): Promise<ApiResponse<NutritionData[]>> =>
      apiClient.get<NutritionData[]>(`/nutrition?start_date=${startDate}&end_date=${endDate}`),
    {
      enabled,
      staleTime: 10 * 60 * 1000, // 10분
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      retries: 2,
    }
  );
}
