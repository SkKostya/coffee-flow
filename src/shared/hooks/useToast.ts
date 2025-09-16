import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

export interface ToastConfig {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

/**
 * Хук для работы с toast-уведомлениями
 */
export const useToast = () => {
  const showToast = useCallback(
    ({ title, message, type = 'info', duration = 5000 }: ToastConfig) => {
      Toast.show({
        type,
        text1: title,
        text2: message,
        visibilityTime: duration,
        position: 'top',
        topOffset: 60,
      });
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast({
        title,
        message,
        type: 'success',
        duration: duration || 4000, // Успешные операции показываем 4 секунды
      });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast({
        title,
        message,
        type: 'error',
        duration: duration || 6000, // Ошибки показываем 6 секунд
      });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast({
        title,
        message,
        type: 'info',
        duration: duration || 5000, // Информация показываем 5 секунд
      });
    },
    [showToast]
  );

  const hideToast = useCallback(() => {
    Toast.hide();
  }, []);

  return {
    showToast,
    showSuccess,
    showError,
    showInfo,
    hideToast,
  };
};
