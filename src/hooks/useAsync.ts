import { useState, useCallback, useEffect, useRef } from 'react';
import { ApiError } from '../services/api.service';

/**
 * A hook to handle async operations with proper loading, error, and success states
 * Features:
 * - Loading, error, and success states
 * - Automatic cancellation on component unmount
 * - Debounce support
 * - Retry functionality with exponential backoff
 * - Specific handling for API errors (timeout, network, etc.)
 * - Success and error callbacks
 */
interface UseAsyncState<T> {
  loading: boolean;
  error: Error | null;
  value: T | null;
  status: 'idle' | 'pending' | 'success' | 'error';
}

interface UseAsyncReturn<T> extends UseAsyncState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  retry: () => Promise<T | null>;
  isNetworkError: boolean;
  isTimeoutError: boolean;
}

interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  debounceMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  useExponentialBackoff?: boolean;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> {
  const { 
    immediate = false, 
    onSuccess, 
    onError,
    debounceMs = 0,
    maxRetries = 0,
    retryDelayMs = 1000,
    useExponentialBackoff = true
  } = options;
  
  const [state, setState] = useState<UseAsyncState<T>>({
    loading: immediate,
    error: null,
    value: null,
    status: immediate ? 'pending' : 'idle'
  });

  const isMountedRef = useRef(true);
  const lastArgsRef = useRef<any[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const asyncFunctionRef = useRef(asyncFunction);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update the ref when asyncFunction changes
  useEffect(() => {
    asyncFunctionRef.current = asyncFunction;
  }, [asyncFunction]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    if (!isMountedRef.current) return;
    
    setState({
      loading: false,
      error: null,
      value: null,
      status: 'idle'
    });
    retryCountRef.current = 0;
  }, []);

  const executeImpl = useCallback(
    async (...args: any[]): Promise<T | null> => {
      if (!isMountedRef.current) return null;
      
      // Clear any existing safety timeout
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
      
      setState(prevState => ({
        ...prevState,
        loading: true,
        error: null,
        status: 'pending'
      }));

      // Set a safety timeout to ensure loading state isn't stuck
      safetyTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          console.warn('Safety timeout triggered for async operation');
          setState(prevState => {
            // Only update if still loading
            if (prevState.loading) {
              return {
                ...prevState,
                loading: false,
                error: new Error("Operation timed out"),
                status: 'error'
              };
            }
            return prevState;
          });
          
          onError?.(new Error("Operation timed out"));
        }
      }, 30000); // 30 seconds safety timeout

      try {
        const value = await asyncFunctionRef.current(...args);
        
        // Clear safety timeout
        if (safetyTimeoutRef.current) {
          clearTimeout(safetyTimeoutRef.current);
          safetyTimeoutRef.current = null;
        }
        
        if (!isMountedRef.current) return null;
        
        setState({
          loading: false,
          error: null,
          value,
          status: 'success'
        });

        retryCountRef.current = 0; // Reset retry counter on success
        onSuccess?.(value);
        return value;
      } catch (error: any) {
        // Clear safety timeout
        if (safetyTimeoutRef.current) {
          clearTimeout(safetyTimeoutRef.current);
          safetyTimeoutRef.current = null;
        }
        
        if (!isMountedRef.current) return null;
        
        const err = error instanceof Error ? error : new Error(String(error));
        
        setState({
          loading: false,
          error: err,
          value: null,
          status: 'error'
        });

        onError?.(err);
        return null;
      }
    },
    [onSuccess, onError]
  );

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      // Store the args for potential retry
      lastArgsRef.current = args;
      
      // Clear any existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      
      // If debouncing is enabled, delay execution
      if (debounceMs > 0) {
        return new Promise((resolve) => {
          debounceTimerRef.current = setTimeout(async () => {
            const result = await executeImpl(...args);
            resolve(result);
          }, debounceMs);
        });
      }
      
      // Otherwise execute immediately
      return executeImpl(...args);
    },
    [executeImpl, debounceMs]
  );
  
  const retry = useCallback(async (): Promise<T | null> => {
    if (state.status !== 'error' || retryCountRef.current >= maxRetries) {
      return null;
    }
    
    const currentRetryCount = retryCountRef.current + 1;
    retryCountRef.current = currentRetryCount;
    
    // Calculate delay - use exponential backoff if enabled
    const delay = useExponentialBackoff 
      ? retryDelayMs * Math.pow(2, currentRetryCount - 1) 
      : retryDelayMs;
    
    return new Promise((resolve) => {
      setTimeout(async () => {
        const result = await execute(...lastArgsRef.current);
        resolve(result);
      }, delay);
    });
  }, [execute, maxRetries, retryDelayMs, state.status, useExponentialBackoff]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  // Check if the error is a network connectivity error
  const isNetworkError = state.error instanceof ApiError && 
    (state.error as ApiError).isOfflineError?.();
  
  // Check if the error is a timeout error
  const isTimeoutError = state.error instanceof ApiError && 
    (state.error as ApiError).isTimeoutError?.();

  return {
    ...state,
    execute,
    reset,
    retry,
    isNetworkError: !!isNetworkError,
    isTimeoutError: !!isTimeoutError
  };
}