import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import {
  ApiClientConfig,
  ApiError,
  ApiInterceptors,
  ApiResponse,
  AuthConfig,
  RequestConfig,
  RequestOptions,
} from '../types/api';

// Получаем API_URL из переменных окружения
const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  'https://api.coffeeflow.com';

// Ключ для хранения токена по умолчанию
const DEFAULT_TOKEN_KEY = '@coffee_flow_token';

// Конфигурация по умолчанию
const DEFAULT_CONFIG: ApiClientConfig = {
  baseUrl: API_URL,
  timeout: 10000,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

// Конфигурация аутентификации по умолчанию
const DEFAULT_AUTH_CONFIG: AuthConfig = {
  tokenKey: DEFAULT_TOKEN_KEY,
  getToken: async () => {
    try {
      return await AsyncStorage.getItem(DEFAULT_TOKEN_KEY);
    } catch (error) {
      console.error('Ошибка получения токена:', error);
      return null;
    }
  },
};

/**
 * Универсальный API клиент для всех модулей проекта
 */
export class ApiClient {
  private config: ApiClientConfig;
  private authConfig: AuthConfig;
  private interceptors: ApiInterceptors;

  constructor(
    config: Partial<ApiClientConfig> = {},
    authConfig: Partial<AuthConfig> = {},
    interceptors: ApiInterceptors = {}
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.authConfig = { ...DEFAULT_AUTH_CONFIG, ...authConfig };
    this.interceptors = interceptors;
  }

  /**
   * Получение токена авторизации
   */
  private async getAuthToken(): Promise<string | null> {
    return this.authConfig.getToken();
  }

  /**
   * Базовый метод для выполнения запросов
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    let url = `${this.config.baseUrl}${endpoint}`;

    // Добавляем query параметры если они есть
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const token = await this.getAuthToken();

    // Подготавливаем конфигурацию запроса
    const requestConfig: RequestConfig = {
      method: options.method || 'GET',
      url,
      data: options.body,
      params: options.params,
      headers: {
        ...this.config.defaultHeaders,
        ...options.headers,
      },
    };

    // Добавляем токен авторизации если он есть
    if (token) {
      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Применяем интерцептор запроса
    if (this.interceptors.request) {
      const modifiedConfig = await this.interceptors.request(requestConfig);
      Object.assign(requestConfig, modifiedConfig);
    }

    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method,
        headers: requestConfig.headers,
        body: requestConfig.data,
        signal: AbortSignal.timeout?.(this.config.timeout || 10000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const apiError: ApiError = {
          message:
            errorData.message || `HTTP error! status: ${response.status}`,
          status: response.status,
          code: errorData.code,
        };

        // Проверяем на истечение токена
        if (response.status === 401 && this.authConfig.onTokenExpired) {
          this.authConfig.onTokenExpired();
        }

        throw apiError;
      }

      const data = await response.json();

      // Проверяем, что данные не null или undefined
      if (data === null || data === undefined) {
        const apiError: ApiError = {
          message: 'No data received from server',
          status: response.status,
          code: 'NO_DATA',
        };
        throw apiError;
      }

      const apiResponse: ApiResponse<T> = {
        success: true,
        data,
      };

      // Применяем интерцептор ответа
      if (this.interceptors.response) {
        return (await this.interceptors.response(
          apiResponse
        )) as ApiResponse<T>;
      }

      return apiResponse;
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`${requestConfig.method} ${requestConfig.url}:`, error);

      let apiError: ApiError;

      if (error instanceof Error && 'status' in error) {
        // Это наш ApiError
        apiError = error as ApiError;
      } else {
        apiError = {
          message: error.message || 'Произошла неизвестная ошибка',
        };
      }

      // Применяем интерцептор ошибок
      if (this.interceptors.error) {
        apiError = await this.interceptors.error(apiError);
      }

      throw apiError;
    }
  }

  /**
   * GET запрос
   */
  async get<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST запрос
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : JSON.stringify({}),
    });
  }

  /**
   * PUT запрос
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : JSON.stringify({}),
    });
  }

  /**
   * PATCH запрос
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : JSON.stringify({}),
    });
  }

  /**
   * DELETE запрос
   */
  async delete<T>(
    endpoint: string,
    data?: unknown,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      body: data ? JSON.stringify(data) : JSON.stringify({}),
    });
  }

  /**
   * Обновление конфигурации
   */
  updateConfig(config: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Обновление конфигурации аутентификации
   */
  updateAuthConfig(authConfig: Partial<AuthConfig>): void {
    this.authConfig = { ...this.authConfig, ...authConfig };
  }

  /**
   * Обновление интерцепторов
   */
  updateInterceptors(interceptors: Partial<ApiInterceptors>): void {
    this.interceptors = { ...this.interceptors, ...interceptors };
  }
}

// Создаем экземпляр API клиента по умолчанию
export const apiClient = new ApiClient();

// Экспортируем класс для создания специализированных клиентов
export default ApiClient;
