// src/shared/hooks/usePerformanceMonitor.ts
// Хук для мониторинга производительности

import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
}

/**
 * Хук для мониторинга производительности компонента
 * @param componentName - имя компонента для отладки
 * @param enabled - включить мониторинг
 * @returns метрики производительности
 */
export const usePerformanceMonitor = (
  componentName: string,
  enabled: boolean = __DEV__
): PerformanceMetrics => {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const lastRenderTime = useRef(0);
  const startTime = useRef(0);

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    maxRenderTime: 0,
    minRenderTime: 0,
  });

  // Начало рендера
  if (enabled) {
    startTime.current = performance.now();
  }

  useEffect(() => {
    if (!enabled) return;

    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    renderCount.current += 1;
    lastRenderTime.current = renderTime;
    renderTimes.current.push(renderTime);

    // Ограничиваем количество измерений
    if (renderTimes.current.length > 100) {
      renderTimes.current = renderTimes.current.slice(-50);
    }

    const times = renderTimes.current;
    const averageRenderTime =
      times.reduce((sum, time) => sum + time, 0) / times.length;
    const maxRenderTime = Math.max(...times);
    const minRenderTime = Math.min(...times);

    setMetrics({
      renderCount: renderCount.current,
      lastRenderTime,
      averageRenderTime,
      maxRenderTime,
      minRenderTime,
    });

    // Логируем медленные рендеры
    if (renderTime > 16) {
      // Больше 16ms (60fps)
      console.warn(
        `[Performance] ${componentName} slow render: ${renderTime.toFixed(2)}ms`
      );
    }
  });

  return metrics;
};

/**
 * Хук для измерения времени выполнения функции
 * @param fn - функция для измерения
 * @param deps - зависимости
 * @returns функция с измерением времени
 */
export const useTimedFunction = <T extends (...args: any[]) => any>(
  fn: T,
  deps: React.DependencyList
): T => {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();

    console.log(`Function execution time: ${(end - start).toFixed(2)}ms`);

    return result;
  }) as T;
};
