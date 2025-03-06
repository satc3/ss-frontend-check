import { useState, useCallback } from 'react';
import { handleApiError } from '@/utils/errorHandler';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  resetOnExecute?: boolean;
}

/**
 * API通信を扱うカスタムフック
 * 
 * @param apiFunction - API呼び出し関数
 * @param options - オプション設定
 * @returns 実行関数、データ、ローディング状態、エラー
 * 
 * @example
 * // 使用例
 * const { execute: fetchUsers, data: users, isLoading } = useApi(getUsers);
 * 
 * useEffect(() => {
 *   fetchUsers();
 * }, [fetchUsers]);
 */
export function useApi<T, P = void>(
  apiFunction: (params: P) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (params: P) => {
      setIsLoading(true);
      
      if (options.resetOnExecute !== false) {
        setError(null);
      }
      
      try {
        const result = await apiFunction(params);
        setData(result);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
        setError(errorMessage);
        handleApiError(err);
        options.onError?.(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction, options]
  );

  return { 
    execute, 
    data, 
    isLoading, 
    error,
    // 追加のユーティリティ関数
    reset: useCallback(() => {
      setData(null);
      setError(null);
    }, [])
  };
}

/**
 * ページネーション対応APIリクエスト用のカスタムフック
 */
export function usePaginatedApi<T, P extends { page?: number; per_page?: number }>(
  apiFunction: (params: P) => Promise<{
    data: T[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }
  }>,
  defaultParams: P,
  options: UseApiOptions<{
    data: T[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    }
  }> = {}
) {
  const [page, setPage] = useState(defaultParams.page || 1);
  const [perPage, setPerPage] = useState(defaultParams.per_page || 10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const apiHook = useApi(apiFunction, {
    ...options,
    onSuccess: (result) => {
      setTotalItems(result.meta.total);
      setTotalPages(result.meta.last_page);
      options.onSuccess?.(result);
    }
  });
  
  const fetchPage = useCallback(
    (pageNumber: number) => {
      setPage(pageNumber);
      const params = { ...defaultParams, page: pageNumber, per_page: perPage } as P;
      return apiHook.execute(params);
    },
    [apiHook, defaultParams, perPage]
  );
  
  const changePerPage = useCallback(
    (newPerPage: number) => {
      setPerPage(newPerPage);
      const params = { ...defaultParams, page: 1, per_page: newPerPage } as P;
      setPage(1);
      return apiHook.execute(params);
    },
    [apiHook, defaultParams]
  );
  
  return {
    ...apiHook,
    page,
    perPage,
    totalItems,
    totalPages,
    fetchPage,
    changePerPage
  };
} 