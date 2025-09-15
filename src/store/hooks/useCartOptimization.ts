// src/store/hooks/useCartOptimization.ts
// Хук для оптимизации работы с корзиной

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { memoizeCartCalculations } from '../../cart/utils/cartUtils';
import { useAppSelector } from '../hooks';
import {
  selectCartHash,
  selectCartIsEmpty,
  selectCartLastUpdated,
  selectCartMetrics,
  selectCartTotalAmount,
  selectCartTotalItems,
} from '../selectors/cartSelectors';

/**
 * Хук для оптимизации работы с корзиной
 */
export const useCartOptimization = () => {
  // ===== СЕЛЕКТОРЫ =====

  const cartHash = useAppSelector(selectCartHash);
  const lastUpdated = useAppSelector(selectCartLastUpdated);
  const isEmpty = useAppSelector(selectCartIsEmpty);
  const totalAmount = useAppSelector(selectCartTotalAmount);
  const totalItems = useAppSelector(selectCartTotalItems);
  const metrics = useAppSelector(selectCartMetrics);

  // ===== МЕМОИЗАЦИЯ =====

  /**
   * Мемоизированные вычисления корзины
   */
  const memoizedCalculations = useMemo(() => {
    return memoizeCartCalculations();
  }, []);

  /**
   * Кэш для предотвращения лишних вычислений
   */
  const cacheRef = useRef<{
    hash: string;
    calculations: ReturnType<typeof memoizedCalculations>;
  }>({
    hash: '',
    calculations: memoizedCalculations(null),
  });

  // ===== ОПТИМИЗИРОВАННЫЕ ВЫЧИСЛЕНИЯ =====

  /**
   * Получить оптимизированные метрики корзины
   */
  const getOptimizedMetrics = useCallback(() => {
    if (cacheRef.current.hash !== cartHash) {
      cacheRef.current.hash = cartHash;
      cacheRef.current.calculations = memoizedCalculations(null); // Передаем null, так как cart уже в селекторах
    }
    return cacheRef.current.calculations;
  }, [cartHash, memoizedCalculations]);

  /**
   * Проверить, нужно ли обновлять UI
   */
  const shouldUpdateUI = useCallback(() => {
    return cacheRef.current.hash !== cartHash;
  }, [cartHash]);

  // ===== ДЕБАУНСИНГ =====

  /**
   * Дебаунсинг для обновлений
   */
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedUpdate = useCallback(
    (callback: () => void, delay: number = 300) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        callback();
        debounceRef.current = null;
      }, delay);
    },
    []
  );

  // ===== ОЧИСТКА =====

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // ===== АНАЛИЗ ПРОИЗВОДИТЕЛЬНОСТИ =====

  /**
   * Получить статистику производительности
   */
  const getPerformanceStats = useCallback(() => {
    const now = Date.now();
    const lastUpdateTime = lastUpdated ? new Date(lastUpdated).getTime() : 0;
    const timeSinceLastUpdate = now - lastUpdateTime;

    return {
      cartHash,
      lastUpdated,
      timeSinceLastUpdate,
      isEmpty,
      totalAmount,
      totalItems,
      cacheHit: cacheRef.current.hash === cartHash,
      shouldUpdate: shouldUpdateUI(),
    };
  }, [cartHash, lastUpdated, isEmpty, totalAmount, totalItems, shouldUpdateUI]);

  // ===== ПРЕДСКАЗАНИЯ =====

  /**
   * Предсказать следующее действие пользователя
   */
  const predictNextAction = useCallback(() => {
    if (isEmpty) {
      return 'browse_products';
    }

    if (totalAmount > 5000) {
      return 'checkout';
    }

    if (totalItems > 5) {
      return 'review_cart';
    }

    return 'continue_shopping';
  }, [isEmpty, totalAmount, totalItems]);

  // ===== ОПТИМИЗАЦИЯ РЕНДЕРИНГА =====

  /**
   * Получить оптимизированные данные для рендеринга
   */
  const getOptimizedRenderData = useCallback(() => {
    const optimizedMetrics = getOptimizedMetrics();
    const performanceStats = getPerformanceStats();
    const predictedAction = predictNextAction();

    return {
      metrics: optimizedMetrics,
      performance: performanceStats,
      prediction: predictedAction,
      shouldRender: shouldUpdateUI(),
    };
  }, [
    getOptimizedMetrics,
    getPerformanceStats,
    predictNextAction,
    shouldUpdateUI,
  ]);

  // ===== ВОЗВРАЩАЕМЫЕ ДАННЫЕ =====

  return {
    // Оптимизированные данные
    optimizedMetrics: getOptimizedMetrics(),
    renderData: getOptimizedRenderData(),

    // Утилиты
    debouncedUpdate,
    shouldUpdateUI: shouldUpdateUI(),
    getPerformanceStats,

    // Предсказания
    predictedAction: predictNextAction(),

    // Кэш
    cacheHit: cacheRef.current.hash === cartHash,
    cartHash,
  };
};
