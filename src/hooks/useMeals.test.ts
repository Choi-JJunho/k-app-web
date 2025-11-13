import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMeals } from './useMeals';
import * as apiClientModule from '@/lib/api';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('useMeals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should fetch meals for a given date', async () => {
    const mockMeals = [
      {
        id: '1',
        date: '2025-01-15',
        dining_time: 'breakfast' as const,
        menu: ['계란찜', '밥', '김치'],
        kcal: '500',
        price: '5000',
        place: '학생식당',
      },
    ];

    vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({
      success: true,
      data: mockMeals,
    });

    const { result } = renderHook(() => useMeals('2025-01-15'));

    await waitFor(() => {
      expect(result.current.data).toEqual(mockMeals);
    });

    expect(apiClientModule.apiClient.get).toHaveBeenCalledWith(
      '/meals?date=2025-01-15'
    );
  });

  it('should format Date object to string', async () => {
    const mockMeals = [] as any[];

    vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({
      success: true,
      data: mockMeals,
    });

    const date = new Date('2025-01-15');
    renderHook(() => useMeals(date));

    await waitFor(() => {
      expect(apiClientModule.apiClient.get).toHaveBeenCalledWith(
        '/meals?date=2025-01-15'
      );
    });
  });

  it('should respect enabled option', () => {
    vi.spyOn(apiClientModule.apiClient, 'get').mockResolvedValue({
      success: true,
      data: [],
    });

    renderHook(() => useMeals('2025-01-15', { enabled: false }));

    expect(apiClientModule.apiClient.get).not.toHaveBeenCalled();
  });
});
