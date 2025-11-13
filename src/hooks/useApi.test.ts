import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useApi } from './useApi';
import type { ApiResponse } from '@/types';

describe('useApi', () => {
  it('should not fetch when enabled is false', () => {
    const fetcher = vi.fn().mockResolvedValue({
      success: true,
      data: { test: true },
    } as ApiResponse<{ test: boolean }>);

    const { result } = renderHook(() =>
      useApi(fetcher, { enabled: false, refetchOnMount: false })
    );

    expect(fetcher).not.toHaveBeenCalled();
    expect(result.current.data).toBeNull();
  });

  it('should use initial data', () => {
    const initialData = { id: 1, name: 'Initial' };
    const fetcher = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 2, name: 'Fetched' },
    } as ApiResponse<typeof initialData>);

    const { result } = renderHook(() =>
      useApi(fetcher, { initialData, refetchOnMount: false })
    );

    expect(result.current.data).toEqual(initialData);
  });

  it('should reset state to initial data', () => {
    const initialData = { id: 1, name: 'Test' };
    const fetcher = vi.fn().mockResolvedValue({
      success: true,
      data: initialData,
    } as ApiResponse<typeof initialData>);

    const { result } = renderHook(() =>
      useApi(fetcher, { initialData, refetchOnMount: false })
    );

    expect(result.current.data).toEqual(initialData);

    act(() => {
      result.current.reset();
    });

    // Reset should revert to initial data
    expect(result.current.data).toEqual(initialData);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
