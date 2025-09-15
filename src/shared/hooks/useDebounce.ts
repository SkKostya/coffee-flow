// src/shared/hooks/useDebounce.ts
// Хук для дебаунсинга значений

import { useEffect, useState } from 'react';

/**
 * Хук для дебаунсинга значения
 * @param value - значение для дебаунсинга
 * @param delay - задержка в миллисекундах
 * @returns дебаунсированное значение
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Хук для дебаунсинга функции
 * @param callback - функция для дебаунсинга
 * @param delay - задержка в миллисекундах
 * @returns дебаунсированная функция
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(callback);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);

  return debouncedCallback;
};
