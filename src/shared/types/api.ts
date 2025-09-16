// Общие типы для API запросов и ответов

// Базовый тип для API ответов (только успешные ответы)
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Тип для ошибок API
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Тип для конфигурации запроса
export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: string;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

// Тип для HTTP методов
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Тип для опций запроса
export interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: string;
  params?: Record<string, unknown>;
  timeout?: number;
}

// Тип для конфигурации API клиента
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

// Тип для интерцепторов
export interface ApiInterceptors {
  request?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  response?: (
    response: ApiResponse<unknown>
  ) => ApiResponse<unknown> | Promise<ApiResponse<unknown>>;
  error?: (error: ApiError) => ApiError | Promise<ApiError>;
}

// Тип для аутентификации
export interface AuthConfig {
  tokenKey: string;
  getToken: () => Promise<string | null>;
  onTokenExpired?: () => void;
}

// Тип для защищенных запросов
export interface ProtectedRequestConfig extends RequestConfig {
  requiresAuth: boolean;
}

// Тип для публичных запросов
export interface PublicRequestConfig extends RequestConfig {
  requiresAuth: false;
}
