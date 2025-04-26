/**
 * Helper functions for the application
 */
import { ApiError } from '../services/api.service';

/**
 * Format a date string to a human-readable format
 * @param dateString ISO date string
 * @param options Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format time from ISO date string
 */
export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Get relative time (e.g. "2 hours ago", "in 3 days")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffInMilliseconds = date.getTime() - now.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  if (Math.abs(diffInDays) > 0) {
    return rtf.format(diffInDays, 'day');
  }
  if (Math.abs(diffInHours) > 0) {
    return rtf.format(diffInHours, 'hour');
  }
  if (Math.abs(diffInMinutes) > 0) {
    return rtf.format(diffInMinutes, 'minute');
  }
  return rtf.format(diffInSeconds, 'second');
};

/**
 * Format confidence percentage
 */
export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence)}%`;
};

/**
 * Handle API errors consistently with improved handling for different error types
 */
export const handleApiError = (error: unknown): string => {
  // First check if it's our enhanced ApiError
  if (error instanceof ApiError) {
    // Check for specific conditions
    if (error.isOfflineError()) {
      return 'No internet connection. Please check your network and try again.';
    }
    
    if (error.isTimeoutError()) {
      return 'Request timed out. The server might be busy, please try again later.';
    }
    
    // Handle based on status code
    switch (error.status) {
      case 400:
        return 'The request was invalid. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please login again.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'The requested information could not be found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Our team has been notified.';
      case 502:
        return 'Bad gateway. The server might be down for maintenance.';
      case 503:
        return 'Service unavailable. Please try again later.';
      case 504:
        return 'Gateway timeout. The server might be overloaded.';
      default:
        return error.message || 'An unknown error occurred';
    }
  }
  
  // Handle regular Error objects
  if (error instanceof Error) {
    if (error.message.includes('NetworkError') || error.message.includes('network')) {
      return 'Network error. Please check your internet connection.';
    }
    if (error.message.includes('timeout') || error.message.includes('timed out')) {
      return 'Request timed out. Please try again later.';
    }
    return error.message;
  }
  
  // For unknown error types
  return 'An unknown error occurred';
};

/**
 * Generate a human-readable error message for display to users
 */
export const getErrorMessage = (error: unknown, defaultMessage = 'Something went wrong'): string => {
  if (!error) return defaultMessage;
  
  // First, try to use our specialized API error handler
  if (error instanceof ApiError || error instanceof Error) {
    return handleApiError(error);
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle object errors with message property
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof (error as any).message === 'string') {
      return (error as any).message;
    }
  }
  
  return defaultMessage;
};

/**
 * Generate a random ID (for demo purposes)
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Parse URL query parameters
 */
export const parseQueryParams = (queryString: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};

/**
 * Debounce function to limit how often a function is called
 */
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<F>) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Convert camelCase to Title Case
 */
export const camelToTitleCase = (camelCase: string): string => {
  // Add space before capital letters and uppercase the first character
  const titleCase = camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
  
  return titleCase;
};

/**
 * Format a number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};