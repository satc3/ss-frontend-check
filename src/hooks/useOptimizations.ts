import { useMemo, useCallback, useState, useEffect } from 'react';

/**
 * 依存配列に基づいて値をメモ化するフック
 * @param factory メモ化する値を生成する関数
 * @param deps 依存配列
 */
export function useMemoValue<T>(factory: () => T, deps: React.DependencyList): T {
  return useMemo(factory, deps);
}

/**
 * 依存配列に基づいてコールバック関数をメモ化するフック
 * @param callback メモ化するコールバック関数
 * @param deps 依存配列
 */
export function useCallbackFunction<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

/**
 * データのフィルタリングをメモ化するフック
 * @param items フィルタリングするアイテムの配列
 * @param filterFn フィルタリング関数
 * @param deps 追加の依存配列
 */
export function useFilteredData<T>(
  items: T[],
  filterFn: (item: T) => boolean,
  deps: React.DependencyList = []
): T[] {
  return useMemo(() => items.filter(filterFn), [items, filterFn, ...deps]);
}

/**
 * 非同期データ取得のための最適化フック
 * @param fetchFn データ取得関数
 * @param deps 依存配列
 */
export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = []
): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [...deps, fetchData]);

  return { data, isLoading, error, refetch };
} 