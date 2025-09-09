import { useState } from 'react';
import {
  AuthActions,
  AuthState,
  LoginCredentials,
  RegistrationCredentials,
} from '../../types/auth';
import { authApi } from '../services/authApi';

export const useAuth = (): AuthState & AuthActions => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const credentials: LoginCredentials = {
        phoneNumber,
        password,
      };

      const response = await authApi.signin(credentials);

      if (response.success && response.token) {
        // TODO: Сохранить токен в AsyncStorage или SecureStore
        console.log('Успешная авторизация:', response);
        // TODO: Обновить состояние пользователя в контексте
      } else {
        setError(response.message || 'Ошибка авторизации');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Произошла ошибка при авторизации';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!phoneNumber || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const credentials: RegistrationCredentials = {
        phoneNumber,
        firstName: '', // TODO: Получить из формы регистрации
        lastName: '', // TODO: Получить из формы регистрации
        password,
      };

      const response = await authApi.signup(credentials);

      if (response.success && response.token) {
        // TODO: Сохранить токен в AsyncStorage или SecureStore
        console.log('Успешная регистрация:', response);
        // TODO: Обновить состояние пользователя в контексте
      } else {
        setError(response.message || 'Ошибка регистрации');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Произошла ошибка при регистрации';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log('Forgot password');
  };

  return {
    phoneNumber,
    password,
    setPhoneNumber,
    setPassword,
    handleLogin,
    handleRegistration,
    handleForgotPassword,
    isLoading,
    error,
  };
};
