// src/store/hooks/useCartErrorHandling.ts
// Хук для обработки ошибок корзины

import { useCallback, useEffect, useState } from 'react';
import { useGlobalToast } from '../../shared/hooks/useGlobalToast';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectCartCanRetry,
  selectCartError,
  selectCartErrorDetails,
  selectCartLastAction,
  selectCartRetryCount,
} from '../selectors/cartSelectors';
import {
  clearError,
  incrementRetryCount,
  loadCart,
  resetRetryCount,
} from '../slices/cartSlice';

/**
 * Хук для обработки ошибок корзины
 */
export const useCartErrorHandling = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useGlobalToast();

  // ===== СЕЛЕКТОРЫ =====

  const error = useAppSelector(selectCartError);
  const errorDetails = useAppSelector(selectCartErrorDetails);
  const canRetry = useAppSelector(selectCartCanRetry);
  const retryCount = useAppSelector(selectCartRetryCount);
  const lastAction = useAppSelector(selectCartLastAction);

  // ===== ЛОКАЛЬНОЕ СОСТОЯНИЕ =====

  const [retryAttempts, setRetryAttempts] = useState<number[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryDelay, setRetryDelay] = useState(1000);

  // ===== ОБРАБОТКА ОШИБОК =====

  /**
   * Очистить ошибку
   */
  const clearErrorState = useCallback(() => {
    dispatch(clearError());
    setRetryAttempts([]);
    setIsRetrying(false);
  }, [dispatch]);

  /**
   * Повторить последнее действие
   */
  const retryLastAction = useCallback(async () => {
    if (!canRetry || !lastAction || isRetrying) {
      return;
    }

    setIsRetrying(true);
    dispatch(incrementRetryCount());

    try {
      // Добавляем задержку перед повтором
      await new Promise((resolve) => setTimeout(resolve, retryDelay));

      // Повторяем последнее действие
      switch (lastAction.type) {
        case 'loadCart':
          await dispatch(loadCart()).unwrap();
          break;
        case 'addCartItem':
        case 'updateCartItem':
        case 'removeCartItem':
        case 'clearCart':
        case 'getCartTotal':
          // Для этих действий нужно загрузить корзину заново
          await dispatch(loadCart()).unwrap();
          break;
        default:
          console.warn('Unknown action type for retry:', lastAction.type);
      }

      // Сбрасываем счетчик попыток при успехе
      dispatch(resetRetryCount());
      setRetryAttempts([]);
      showToast('success', 'Операция выполнена', 'Корзина успешно обновлена');
    } catch (error) {
      console.error('Retry failed:', error);
      setRetryAttempts((prev) => [...prev, Date.now()]);
      showToast('error', 'Ошибка повтора', 'Не удалось повторить операцию');
    } finally {
      setIsRetrying(false);
    }
  }, [canRetry, lastAction, isRetrying, dispatch, retryDelay]);

  /**
   * Автоматический повтор с экспоненциальной задержкой
   */
  const autoRetry = useCallback(async () => {
    if (!canRetry || isRetrying) {
      return;
    }

    const maxRetries = 3;
    const baseDelay = 1000;
    const maxDelay = 10000;

    if (retryAttempts.length >= maxRetries) {
      console.warn('Max retry attempts reached');
      return;
    }

    // Экспоненциальная задержка
    const delay = Math.min(
      baseDelay * Math.pow(2, retryAttempts.length),
      maxDelay
    );

    setRetryDelay(delay);
    await retryLastAction();
  }, [canRetry, isRetrying, retryAttempts.length, retryLastAction]);

  // ===== АНАЛИЗ ОШИБОК =====

  /**
   * Получить тип ошибки
   */
  const getErrorType = useCallback(() => {
    if (!error) return null;

    if (error.includes('сеть') || error.includes('network')) {
      return 'network';
    }
    if (error.includes('время') || error.includes('timeout')) {
      return 'timeout';
    }
    if (error.includes('сервер') || error.includes('server')) {
      return 'server';
    }
    if (error.includes('валидация') || error.includes('validation')) {
      return 'validation';
    }
    if (error.includes('авторизация') || error.includes('unauthorized')) {
      return 'auth';
    }

    return 'unknown';
  }, [error]);

  /**
   * Получить рекомендации по исправлению
   */
  const getErrorRecommendations = useCallback(() => {
    const errorType = getErrorType();

    switch (errorType) {
      case 'network':
        return [
          'Проверьте подключение к интернету',
          'Попробуйте обновить страницу',
          'Проверьте настройки сети',
        ];
      case 'timeout':
        return [
          'Попробуйте еще раз',
          'Проверьте скорость интернета',
          'Обратитесь в поддержку',
        ];
      case 'server':
        return [
          'Сервер временно недоступен',
          'Попробуйте позже',
          'Обратитесь в поддержку',
        ];
      case 'validation':
        return [
          'Проверьте введенные данные',
          'Убедитесь в корректности формы',
          'Попробуйте еще раз',
        ];
      case 'auth':
        return [
          'Войдите в систему заново',
          'Проверьте авторизацию',
          'Обратитесь в поддержку',
        ];
      default:
        return [
          'Попробуйте еще раз',
          'Обратитесь в поддержку',
          'Проверьте подключение',
        ];
    }
  }, [getErrorType]);

  // ===== УВЕДОМЛЕНИЯ =====

  /**
   * Показать уведомление об ошибке
   */
  const showErrorNotification = useCallback(() => {
    if (!error) return;

    const errorType = getErrorType();
    const recommendations = getErrorRecommendations();

    // Показываем toast уведомление об ошибке
    showToast('error', 'Ошибка корзины', error);

    console.error('Cart Error:', {
      message: error,
      type: errorType,
      recommendations,
      canRetry,
      retryCount,
    });
  }, [
    error,
    getErrorType,
    getErrorRecommendations,
    canRetry,
    retryCount,
    showToast,
  ]);

  // ===== АВТОМАТИЧЕСКАЯ ОБРАБОТКА =====

  useEffect(() => {
    if (error) {
      showErrorNotification();
    }
  }, [error, showErrorNotification]);

  // ===== ВОЗВРАЩАЕМЫЕ ДАННЫЕ =====

  return {
    // Состояние ошибок
    error,
    errorDetails,
    hasError: !!error,
    canRetry,
    isRetrying,
    retryCount,

    // Действия
    clearError: clearErrorState,
    retry: retryLastAction,
    autoRetry,

    // Анализ
    errorType: getErrorType(),
    recommendations: getErrorRecommendations(),

    // Утилиты
    showErrorNotification,
  };
};
