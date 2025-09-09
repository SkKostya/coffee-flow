import { publicApiClient } from '../../shared/api';
import {
  AuthResponse,
  LoginCredentials,
  RegistrationCredentials,
} from '../../types/auth';

// API сервис для аутентификации
export const authApi = {
  // Регистрация пользователя
  async signup(credentials: RegistrationCredentials): Promise<AuthResponse> {
    try {
      const response = await publicApiClient.post<AuthResponse>(
        '/clients/signup',
        credentials
      );

      if (!response.success) {
        throw new Error(response.error || 'Ошибка регистрации');
      }

      return response.data!;
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    }
  },

  // Авторизация пользователя
  async signin(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await publicApiClient.post<AuthResponse>(
        '/clients/signin',
        credentials
      );

      if (!response.success) {
        throw new Error(response.error || 'Ошибка авторизации');
      }

      return response.data!;
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      throw error;
    }
  },
};

export default authApi;
