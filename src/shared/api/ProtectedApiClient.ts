import {
  ApiClientConfig,
  ApiInterceptors,
  ApiResponse,
  AuthConfig,
  RequestOptions,
} from '../types/api';
import { ApiClient } from './ApiClient';
import { authErrorHandler } from './authErrorHandler';

/**
 * API клиент для защищенных запросов (требует авторизации)
 */
export class ProtectedApiClient extends ApiClient {
  constructor(
    config: Partial<ApiClientConfig> = {},
    authConfig: Partial<AuthConfig> = {},
    interceptors: ApiInterceptors = {}
  ) {
    // Настраиваем обработчик ошибок авторизации
    const authConfigWithErrorHandler: Partial<AuthConfig> = {
      ...authConfig,
      onTokenExpired: () => {
        authErrorHandler.handleAuthError(
          'Сессия истекла. Необходимо войти в систему'
        );
      },
    };

    // Настраиваем интерцептор ошибок для обработки 401/403
    const interceptorsWithAuthError: ApiInterceptors = {
      ...interceptors,
      error: async (error) => {
        // Обрабатываем ошибки авторизации
        if (error.status === 401 || error.status === 403) {
          authErrorHandler.handleAuthError(error.message);
          // Не пробрасываем ошибку дальше, так как уже обработали редирект
          return error;
        }

        // Вызываем оригинальный интерцептор ошибок если он есть
        if (interceptors.error) {
          return await interceptors.error(error);
        }

        return error;
      },
    };

    super(config, authConfigWithErrorHandler, interceptorsWithAuthError);
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
