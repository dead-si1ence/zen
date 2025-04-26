import { AppContext } from '../App';
import { useContext } from 'react';

/**
 * Base class for API services
 * Provides methods for making HTTP requests to the backend
 */
export class ApiService {
  private baseUrl: string;
  private apiKey: string | null;
  private defaultTimeout: number = 10000; // 10 seconds default timeout

  constructor(baseUrl: string, apiKey: string | null = null) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Check if the device is online
   * @returns Promise<boolean> True if online, false if offline
   */
  private async checkNetworkConnectivity(): Promise<boolean> {
    return navigator.onLine;
  }

  /**
   * Make a GET request to the API
   * @param endpoint The API endpoint
   * @param params Optional query parameters
   * @param timeout Optional timeout in milliseconds
   */
  async get<T>(
    endpoint: string, 
    params: Record<string, string> = {}, 
    timeout: number = this.defaultTimeout
  ): Promise<T> {
    // Check network connectivity
    const isOnline = await this.checkNetworkConnectivity();
    if (!isOnline) {
      throw new ApiError(0, 'No internet connection', { offline: true });
    }

    const url = this.buildUrl(endpoint, params);
    
    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal
      });
  
      return await this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout', { timeout });
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Make a POST request to the API
   * @param endpoint The API endpoint
   * @param data The data to send
   * @param timeout Optional timeout in milliseconds
   */
  async post<T>(
    endpoint: string, 
    data: unknown, 
    timeout: number = this.defaultTimeout
  ): Promise<T> {
    // Check network connectivity
    const isOnline = await this.checkNetworkConnectivity();
    if (!isOnline) {
      throw new ApiError(0, 'No internet connection', { offline: true });
    }

    const url = this.buildUrl(endpoint);
    
    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: controller.signal
      });
  
      return await this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout', { timeout });
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Make a PUT request to the API
   * @param endpoint The API endpoint
   * @param data The data to send
   * @param timeout Optional timeout in milliseconds
   */
  async put<T>(
    endpoint: string, 
    data: unknown, 
    timeout: number = this.defaultTimeout
  ): Promise<T> {
    // Check network connectivity
    const isOnline = await this.checkNetworkConnectivity();
    if (!isOnline) {
      throw new ApiError(0, 'No internet connection', { offline: true });
    }

    const url = this.buildUrl(endpoint);
    
    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: controller.signal
      });
  
      return await this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout', { timeout });
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Make a DELETE request to the API
   * @param endpoint The API endpoint
   * @param timeout Optional timeout in milliseconds
   */
  async delete<T>(
    endpoint: string, 
    timeout: number = this.defaultTimeout
  ): Promise<T> {
    // Check network connectivity
    const isOnline = await this.checkNetworkConnectivity();
    if (!isOnline) {
      throw new ApiError(0, 'No internet connection', { offline: true });
    }

    const url = this.buildUrl(endpoint);
    
    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: controller.signal
      });
  
      return await this.handleResponse<T>(response);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout', { timeout });
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Build the full URL for the API request
   * @param endpoint The API endpoint
   * @param params Optional query parameters
   */
  private buildUrl(endpoint: string, params: Record<string, string> = {}): string {
    try {
      // Normalize baseUrl and endpoint
      const normalizedBaseUrl = this.baseUrl.endsWith('/') 
        ? this.baseUrl.slice(0, -1) 
        : this.baseUrl;
        
      const normalizedEndpoint = endpoint.startsWith('/') 
        ? endpoint.slice(1) 
        : endpoint;
      
      const url = new URL(`${normalizedBaseUrl}/${normalizedEndpoint}`);
      
      // Add query parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
  
      return url.toString();
    } catch (error) {
      console.error('Error building URL:', error);
      throw new ApiError(500, 'Invalid URL configuration');
    }
  }

  /**
   * Get the headers for the API request
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * Handle the API response
   * @param response The fetch response object
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new ApiError(
          response.status,
          errorData.message || `Error ${response.status}: ${response.statusText}`,
          errorData
        );
      } catch (e: unknown) {
        // If parsing JSON fails, throw a generic error
        if (e instanceof ApiError) throw e;
        
        throw new ApiError(
          response.status,
          `Error ${response.status}: ${response.statusText}`,
          { originalError: e instanceof Error ? e.message : 'Unknown error' }
        );
      }
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    try {
      // Parse JSON response
      return await response.json() as T;
    } catch (e: unknown) {
      throw new ApiError(
        500,
        'Failed to parse response',
        { originalError: e instanceof Error ? e.message : 'Unknown error' }
      );
    }
  }
  
  /**
   * Set the default timeout for all requests
   * @param timeout Timeout in milliseconds
   */
  setDefaultTimeout(timeout: number): void {
    this.defaultTimeout = timeout;
  }
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
  
  /**
   * Check if the error is a network connectivity error
   */
  isOfflineError(): boolean {
    const offlineData = this.data as Record<string, unknown>;
    return this.status === 0 && offlineData && offlineData.offline === true;
  }
  
  /**
   * Check if the error is a timeout error
   */
  isTimeoutError(): boolean {
    return this.status === 408;
  }
}

/**
 * React hook for using the API service
 */
export const useApi = () => {
  const { apiBase, apiKey } = useContext(AppContext);
  return new ApiService(apiBase, apiKey);
};