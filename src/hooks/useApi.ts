import { useState, useEffect, useCallback, useRef } from 'react';
import { handleApiError } from '@/utils/api';
import type { UseApiReturn, UseMutationReturn, ApiResponse } from '@/types';

interface UseApiOptions<T> {
  initialData?: T | null;
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  retries?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const {
    initialData = null,
    enabled = true,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000, // 5분
    retries = 0,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const lastFetchTimeRef = useRef<number>(0);
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);

  const isStale = useCallback(() => {
    return Date.now() - lastFetchTimeRef.current > staleTime;
  }, [staleTime]);

  const fetchData = useCallback(async (force = false) => {
    if (!enabled || (!force && !isStale() && data !== null)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetcher();
      
      if (!mountedRef.current) return;

      if (response.success && response.data !== undefined) {
        setData(response.data);
        lastFetchTimeRef.current = Date.now();
        retryCountRef.current = 0;
        onSuccess?.(response.data);
      } else {
        throw new Error(response.message || response.error || 'API 요청 실패');
      }
    } catch (err) {
      if (!mountedRef.current) return;

      const apiError = handleApiError(err);
      setError(apiError.message);
      onError?.(apiError);

      // 재시도 로직
      if (retryCountRef.current < retries) {
        retryCountRef.current++;
        setTimeout(() => {
          if (mountedRef.current) {
            fetchData(force);
          }
        }, Math.pow(2, retryCountRef.current) * 1000); // 지수 백오프
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [enabled, isStale, data, fetcher, retries, onSuccess, onError]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setIsLoading(false);
    lastFetchTimeRef.current = 0;
    retryCountRef.current = 0;
  }, [initialData]);

  // 초기 로드
  useEffect(() => {
    if (refetchOnMount) {
      fetchData();
    }
  }, [refetchOnMount, fetchData]);

  // 윈도우 포커스시 재로드
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (isStale()) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, isStale, fetchData]);

  // 컴포넌트 언마운트시 정리
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
    reset,
  };
}

interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (data: TData | null, error: Error | null, variables: TVariables) => void;
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: UseMutationOptions<TData, TVariables> = {}
): UseMutationReturn<TData, TVariables> {
  const { onSuccess, onError, onSettled } = options;

  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mutationFn(variables);
      
      if (response.success && response.data !== undefined) {
        setData(response.data);
        onSuccess?.(response.data, variables);
        onSettled?.(response.data, null, variables);
        return response.data;
      } else {
        throw new Error(response.message || response.error || 'Mutation 실패');
      }
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      onError?.(apiError, variables);
      onSettled?.(null, apiError, variables);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn, onSuccess, onError, onSettled]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    data,
    isLoading,
    error,
    reset,
  };
}

// 특정 조건에서 자동으로 다시 fetch하는 훅
export function useAutoRefetch<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  deps: React.DependencyList,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const result = useApi(fetcher, options);

  useEffect(() => {
    result.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return result;
}

// 무한 스크롤을 위한 훅
export function useInfiniteApi<T>(
  fetcher: (page: number) => Promise<ApiResponse<T[]>>,
  options: UseApiOptions<T[]> = {}
) {
  const [allData, setAllData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const result = useApi(
    () => fetcher(page),
    {
      ...options,
      onSuccess: (data) => {
        if (page === 1) {
          setAllData(data);
        } else {
          setAllData(prev => [...prev, ...data]);
        }
        
        // 데이터가 비어있거나 예상보다 적으면 더 이상 없음
        setHasMore(data.length > 0);
        options.onSuccess?.(data);
      },
    }
  );

  const loadMore = useCallback(() => {
    if (!result.isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [result.isLoading, hasMore]);

  const reset = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
    result.reset();
  }, [result]);

  return {
    ...result,
    data: allData,
    loadMore,
    hasMore,
    reset,
  };
}