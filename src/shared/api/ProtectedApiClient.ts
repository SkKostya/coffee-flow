import {
  ApiClientConfig,
  ApiInterceptors,
  ApiResponse,
  AuthConfig,
  RequestOptions,
} from '../types/api';
import { ApiClient } from './ApiClient';

/**
 * API клиент для защищенных запросов (требует авторизации)
 */
export class ProtectedApiClient extends ApiClient {
  constructor(
    config: Partial<ApiClientConfig> = {},
    authConfig: Partial<AuthConfig> = {},
    interceptors: ApiInterceptors = {}
  ) {
    super(config, authConfig, interceptors);
  }

  /**
   * Защищенный GET запрос
   */
  async get<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return super.get<T>(endpoint, options);
  }

  /**
   * Защищенный POST запрос
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return super.post<T>(endpoint, data, options);
  }

  /**
   * Защищенный PUT запрос
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return super.put<T>(endpoint, data, options);
  }

  /**
   * Защищенный PATCH запрос
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return super.patch<T>(endpoint, data, options);
  }

  /**
   * Защищенный DELETE запрос
   */
  async delete<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return super.delete<T>(endpoint, data, options);
  }
}

// Создаем экземпляр защищенного API клиента
export const protectedApiClient = new ProtectedApiClient();
