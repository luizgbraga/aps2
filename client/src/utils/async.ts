import { useState, useEffect, useCallback } from 'react';

export type Async<T> = {
  loading: boolean;
  result: T | null;
  error: Error | null;
  refetch: (sameAsyncFunc?: (() => Promise<T>) | undefined) => Promise<void>;
};

export const INITIAL_ASYNC = {
  loading: true,
  result: null,
  error: null,
  refetch: () => Promise.resolve(),
};

export const useAsync = <T>(asyncFunc: () => Promise<T>): Async<T> => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const resolve = useCallback((res: T) => {
    setLoading(false);
    setResult(res);
    setError(null);
    return res;
  }, []);

  const reject = useCallback((err: Error) => {
    setLoading(false);
    setResult(null);
    setError(err);
  }, []);

  const refetch = useCallback(
    async (sameAsyncFunc?: () => Promise<T>) => {
      setLoading(true);
      try {
        const res = sameAsyncFunc ? await sameAsyncFunc() : await asyncFunc();
        resolve(res);
      } catch (err) {
        if (err instanceof Error) {
          reject(err);
        } else {
          console.error('Unexpected error:', err);
        }
      }
    },
    [asyncFunc, resolve, reject]
  );

  useEffect(() => {
    refetch();
  }, []);

  return {
    loading,
    result,
    error,
    refetch,
  };
};
