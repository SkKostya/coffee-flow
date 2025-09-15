// src/shared/hooks/useMemoizedCallback.ts
// Хук для мемоизации колбэков

import { useCallback, useRef } from 'react';

/**
 * Хук для мемоизации колбэка с глубоким сравнением зависимостей
 * @param callback - функция для мемоизации
 * @param deps - зависимости
 * @returns мемоизированная функция
 */
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const ref = useRef<{ callback: T; deps: React.DependencyList }>({
    callback,
    deps,
  });

  // Проверяем, изменились ли зависимости
  const depsChanged = deps.some((dep, index) => {
    const prevDep = ref.current.deps[index];
    return dep !== prevDep;
  });

  if (depsChanged) {
    ref.current = { callback, deps };
  }

  return useCallback(ref.current.callback, deps);
};

/**
 * Хук для мемоизации колбэка с кастомной функцией сравнения
 * @param callback - функция для мемоизации
 * @param deps - зависимости
 * @param isEqual - функция сравнения
 * @returns мемоизированная функция
 */
export const useMemoizedCallbackWithCustomCompare = <
  T extends (...args: any[]) => any
>(
  callback: T,
  deps: React.DependencyList,
  isEqual: (
    prevDeps: React.DependencyList,
    nextDeps: React.DependencyList
  ) => boolean
): T => {
  const ref = useRef<{ callback: T; deps: React.DependencyList }>({
    callback,
    deps,
  });

  // Проверяем, изменились ли зависимости с кастомной функцией сравнения
  const depsChanged = !isEqual(ref.current.deps, deps);

  if (depsChanged) {
    ref.current = { callback, deps };
  }

  return useCallback(ref.current.callback, deps);
};
