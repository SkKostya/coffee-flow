import { useCallback } from 'react';
import { authErrorHandler } from '../api/authErrorHandler';

/**
 * Хук для работы с редиректами при ошибках авторизации
 */
export const useAuthRedirectHandler = () => {
  /**
   * Обработка ошибки авторизации
   * Сохраняет текущий путь и редиректит на экран логина
   */
  const handleAuthError = useCallback(
    (
      errorMessage: string = 'Ошибка авторизации. Необходимо войти в систему'
    ) => {
      // Используем authErrorHandler для обработки (он сам покажет Toast)
      authErrorHandler.handleAuthError(errorMessage);
    },
    []
  );

  /**
   * Обработка успешной авторизации
   * Возвращает пользователя на сохраненный путь или на кофейни
   */
  const handleAuthSuccess = useCallback(() => {
    authErrorHandler.handleAuthSuccess();
  }, []);

  /**
   * Обработка отмены авторизации
   * Редиректит на кофейни с показом ошибки
   */
  const handleAuthCancel = useCallback(() => {
    authErrorHandler.handleAuthCancel();
  }, []);

  return {
    handleAuthError,
    handleAuthSuccess,
    handleAuthCancel,
  };
};
