import {
  ApiClientConfig,
  ApiInterceptors,
  ApiResponse,
  RequestOptions,
} from '../types/api';
import { ApiClient } from './ApiClient';

/**
 * API клиент для публичных запросов (не требует авторизации)
 */
export class PublicApiClient extends ApiClient {
  constructor(
    config: Partial<ApiClientConfig> = {},
    interceptors: ApiInterceptors = {}
  ) {
    // Не передаем authConfig для публичных запросов
    super(config, {}, interceptors);
  }

  /**
   * Публичный GET запрос
   */
  async get<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return super.get<T>(endpoint, options);
  }

  /**
   * Публичный POST запрос
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return super.post<T>(endpoint, data, options);
  }

  /**
   * Публичный PUT запрос
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return super.put<T>(endpoint, data, options);
  }

  /**
   * Публичный PATCH запрос
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return super.patch<T>(endpoint, data, options);
  }

  /**
   * Публичный DELETE запрос
   */
  async delete<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return super.delete<T>(endpoint, data, options);
  }
}

// Создаем экземпляр публичного API клиента
export const publicApiClient = new PublicApiClient();
