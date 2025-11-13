import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useNutrition } from './useNutrition';
import * as apiClientModule from '@/lib/api';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('useNutrition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should fetch nutrition data for week period', async () => {
    const mockNutritionData = [
      {
        date: '2025-01-15',
        totalCalories: 2000,
        meals: {
          breakfast: 500,
          lunch: 800,
          dinner: 700,
        },
        nutrients: {
          protein: 80,
          carbs: 250,
          fat: 60,
        },
      },
    ];

    vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({
      success: true,
      data: mockNutritionData,
    });

    const { result } = renderHook(() => useNutrition({ period: 'week' }));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockNutritionData);
    });

    expect(apiClientModule.apiClient.get).toHaveBeenCalled();
    const callArg = (apiClientModule.apiClient.get as any).mock.calls[0][0];
    expect(callArg).toMatch(/^\/nutrition\?start_date=\d{4}-\d{2}-\d{2}&end_date=\d{4}-\d{2}-\d{2}$/);
  });

  it('should fetch nutrition data for month period', async () => {
    const mockNutritionData = [] as any[];

    vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({
      success: true,
      data: mockNutritionData,
    });

    renderHook(() => useNutrition({ period: 'month' }));

    await waitFor(() => {
      expect(apiClientModule.apiClient.get).toHaveBeenCalled();
    });

    const callArg = (apiClientModule.apiClient.get as any).mock.calls[0][0];
    expect(callArg).toMatch(/^\/nutrition\?start_date=\d{4}-\d{2}-\d{2}&end_date=\d{4}-\d{2}-\d{2}$/);
  });

  it('should respect enabled option', () => {
    vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({
      success: true,
      data: [],
    });

    renderHook(() => useNutrition({ enabled: false }));

    expect(apiClientModule.apiClient.get).not.toHaveBeenCalled();
  });
});
