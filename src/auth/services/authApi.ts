import Constants from 'expo-constants';
import {
  AuthResponse,
  LoginCredentials,
  RegistrationCredentials,
} from '../../types/auth';

// Получаем API_URL из переменных окружения
const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ||
  process.env.EXPO_PUBLIC_API_URL;

// Базовый класс для API запросов
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Произошла неизвестная ошибка при выполнении запроса');
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Создаем экземпляр API клиента
const apiClient = new ApiClient();

// API сервис для аутентификации
export const authApi = {
  // Регистрация пользователя
  async signup(credentials: RegistrationCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/clients/signup',
        credentials
      );
      return response;
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    }
  },

  // Авторизация пользователя
  async signin(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/clients/signin',
        credentials
      );
      return response;
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      throw error;
    }
  },
};

export default authApi;
