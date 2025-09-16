import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useColors } from './useColors';

/**
 * Глобальный хук для toast-уведомлений
 * Можно использовать в Redux слайсах и других местах
 */
export const useGlobalToast = () => {
  const colors = useColors();

  const showToast = useCallback(
    (
      type: 'success' | 'error' | 'info',
      title: string,
      message?: string,
      duration?: number
    ) => {
      // Определяем время показа в зависимости от типа
      const getDuration = () => {
        if (duration) return duration;
        switch (type) {
          case 'error':
            return 6000; // Ошибки показываем 6 секунд
          case 'success':
            return 4000; // Успешные операции 4 секунды
          case 'info':
            return 5000; // Информация 5 секунд
          default:
            return 5000;
        }
      };

      Toast.show({
        type,
        text1: title,
        text2: message,
        visibilityTime: getDuration(),
        position: 'top',
        topOffset: 60,
      });
    },
    []
  );

  return { showToast };
};
