// src/store/selectors/cartSelectors.ts
// Селекторы для извлечения данных корзины из store

import { createSelector } from '@reduxjs/toolkit';
import type { CartSliceState } from '../../cart/types/redux';
import {
  calculateCartItemCount,
  calculateCartTotal,
} from '../../cart/utils/cartUtils';
import type { Cart, CartItem, CartPartner } from '../../types/cart';
import type { RootState } from '../store';

// ===== БАЗОВЫЕ СЕЛЕКТОРЫ =====

/**
 * Селектор корзины
 */
export const selectCart = (state: RootState): Cart | null => state.cart.cart;

/**
 * Селектор товаров корзины
 */
export const selectCartItems = (state: RootState): CartItem[] =>
  state.cart.cart?.items || [];

/**
 * Селектор партнера (кофейни)
 */
export const selectCartPartner = (state: RootState): CartPartner | null =>
  state.cart.cart?.partner || null;

/**
 * Селектор состояния загрузки
 */
export const selectCartLoading = (state: RootState): boolean =>
  state.cart.isLoading;

/**
 * Селектор ошибки
 */
export const selectCartError = (state: RootState): string | null =>
  state.cart.error;

/**
 * Селектор инициализации
 */
export const selectCartIsInitialized = (state: RootState): boolean =>
  state.cart.isInitialized;

/**
 * Селектор времени последнего обновления
 */
export const selectCartLastUpdated = (state: RootState): string | null =>
  state.cart.lastUpdated;

/**
 * Селектор количества попыток повтора
 */
export const selectCartRetryCount = (state: RootState): number =>
  state.cart.retryCount;

/**
 * Селектор максимального количества попыток
 */
export const selectCartMaxRetries = (state: RootState): number =>
  state.cart.maxRetries;

/**
 * Селектор последнего действия
 */
export const selectCartLastAction = (
  state: RootState
): CartSliceState['lastAction'] => state.cart.lastAction;

/**
 * Селектор ожидающих действий
 */
export const selectCartPendingActions = (
  state: RootState
): CartSliceState['pendingActions'] => state.cart.pendingActions;

// ===== ВЫЧИСЛЯЕМЫЕ СЕЛЕКТОРЫ =====

/**
 * Селектор общей суммы корзины
 */
export const selectCartTotalAmount = createSelector(
  [selectCartItems],
  (items: CartItem[]): number => {
    return calculateCartTotal(items);
  }
);

/**
 * Селектор общего количества товаров
 */
export const selectCartTotalItems = createSelector(
  [selectCartItems],
  (items: CartItem[]): number => {
    return calculateCartItemCount(items);
  }
);

/**
 * Селектор проверки пустоты корзины
 */
export const selectCartIsEmpty = createSelector(
  [selectCartItems],
  (items: CartItem[]): boolean => {
    return items.length === 0;
  }
);

/**
 * Селектор количества уникальных товаров
 */
export const selectCartUniqueItemsCount = createSelector(
  [selectCartItems],
  (items: CartItem[]): number => {
    return items.length;
  }
);

/**
 * Селектор средней цены товара
 */
export const selectCartAverageItemPrice = createSelector(
  [selectCartTotalAmount, selectCartTotalItems],
  (totalAmount: number, totalItems: number): number => {
    return totalItems > 0 ? totalAmount / totalItems : 0;
  }
);

// ===== СЕЛЕКТОРЫ ДЛЯ ФИЛЬТРАЦИИ =====

/**
 * Селектор товаров по категории
 */
export const selectCartItemsByCategory = createSelector(
  [selectCartItems, (state: RootState, category: string) => category],
  (items: CartItem[], category: string): CartItem[] => {
    return items.filter((item) => item.product.category === category);
  }
);

/**
 * Селектор товаров по кофейне
 */
export const selectCartItemsByCoffeeShop = createSelector(
  [selectCartItems, (state: RootState, coffeeShopId: string) => coffeeShopId],
  (items: CartItem[], coffeeShopId: string): CartItem[] => {
    return items.filter((item) => item.product.coffeeShopId === coffeeShopId);
  }
);

/**
 * Селектор товара по ID
 */
export const selectCartItemById = createSelector(
  [selectCartItems, (state: RootState, itemId: string) => itemId],
  (items: CartItem[], itemId: string): CartItem | null => {
    return items.find((item) => item.id === itemId) || null;
  }
);

// ===== СЕЛЕКТОРЫ ДЛЯ СТАТИСТИКИ =====

/**
 * Селектор статистики по категориям
 */
export const selectCartCategoryStats = createSelector(
  [selectCartItems],
  (items: CartItem[]): Record<string, { count: number; total: number }> => {
    if (items.length === 0) return {};

    return items.reduce((acc, item) => {
      const category = item.product.category;
      if (!acc[category]) {
        acc[category] = { count: 0, total: 0 };
      }
      acc[category].count += item.quantity;
      acc[category].total += item.totalPrice * item.quantity;
      return acc;
    }, {} as Record<string, { count: number; total: number }>);
  }
);

/**
 * Селектор самого дорогого товара
 */
export const selectCartMostExpensiveItem = createSelector(
  [selectCartItems],
  (items: CartItem[]): CartItem | null => {
    if (items.length === 0) return null;
    return items.reduce((max, item) =>
      item.unitPrice > max.unitPrice ? item : max
    );
  }
);

/**
 * Селектор самого дешевого товара
 */
export const selectCartCheapestItem = createSelector(
  [selectCartItems],
  (items: CartItem[]): CartItem | null => {
    if (items.length === 0) return null;
    return items.reduce((min, item) =>
      item.unitPrice < min.unitPrice ? item : min
    );
  }
);

// ===== СЕЛЕКТОРЫ ДЛЯ СОСТОЯНИЙ =====

/**
 * Селектор состояния загрузки для конкретной операции
 */
export const selectCartLoadingByOperation = createSelector(
  [selectCartLoading, (state: RootState, operation: string) => operation],
  (isLoading: boolean, operation: string): boolean => {
    // Пока возвращаем общее состояние загрузки
    // В будущем можно добавить отдельные флаги для каждой операции
    return isLoading;
  }
);

/**
 * Селектор возможности повтора
 */
export const selectCartCanRetry = createSelector(
  [selectCartRetryCount, selectCartMaxRetries, selectCartLastAction],
  (
    retryCount: number,
    maxRetries: number,
    lastAction: CartSliceState['lastAction']
  ): boolean => {
    return retryCount < maxRetries && !!lastAction?.retryable;
  }
);

/**
 * Селектор состояния ошибки с деталями
 */
export const selectCartErrorDetails = createSelector(
  [selectCartError, selectCartRetryCount, selectCartCanRetry],
  (error: string | null, retryCount: number, canRetry: boolean) => {
    return {
      message: error,
      retryCount,
      canRetry,
      isRetryable: canRetry,
    };
  }
);

// ===== СЕЛЕКТОРЫ ДЛЯ ОПТИМИЗАЦИИ =====

/**
 * Селектор хэша корзины для мемоизации
 */
export const selectCartHash = createSelector(
  [selectCart],
  (cart: Cart | null): string => {
    if (!cart) return 'empty';
    return `${cart.id}-${cart.totalItems}-${cart.totalAmount}-${cart.updatedAt}`;
  }
);

/**
 * Селектор метрик корзины
 */
export const selectCartMetrics = createSelector(
  [
    selectCartTotalAmount,
    selectCartTotalItems,
    selectCartAverageItemPrice,
    selectCartUniqueItemsCount,
  ],
  (
    totalAmount: number,
    totalItems: number,
    averagePrice: number,
    uniqueItems: number
  ) => {
    return {
      totalAmount,
      totalItems,
      averagePrice,
      uniqueItems,
      isEmpty: totalItems === 0,
    };
  }
);

// ===== СЕЛЕКТОРЫ ДЛЯ UI =====

/**
 * Селектор данных для отображения корзины
 */
export const selectCartDisplayData = createSelector(
  [
    selectCart,
    selectCartItems,
    selectCartTotalAmount,
    selectCartTotalItems,
    selectCartPartner,
    selectCartIsEmpty,
    selectCartLoading,
    selectCartError,
  ],
  (
    cart: Cart | null,
    items: CartItem[],
    totalAmount: number,
    totalItems: number,
    partner: CartPartner | null,
    isEmpty: boolean,
    isLoading: boolean,
    error: string | null
  ) => {
    return {
      cart,
      items,
      totalAmount,
      totalItems,
      partner,
      isEmpty,
      isLoading,
      error,
      hasItems: !isEmpty,
      canCheckout: !isEmpty && !isLoading && !error,
    };
  }
);

/**
 * Селектор данных для отображения товара
 */
export const selectCartItemDisplayData = createSelector(
  [selectCartItemById, (state: RootState, itemId: string) => itemId],
  (item: CartItem | null, itemId: string) => {
    if (!item) return null;

    return {
      id: item.id,
      name: item.product.name,
      price: item.unitPrice,
      totalPrice: item.totalPrice,
      quantity: item.quantity,
      image: item.product.image,
      customizations: item.customizations,
      notes: item.notes,
      category: item.product.category,
      coffeeShopName: item.product.coffeeShopName,
    };
  }
);

// ===== СЕЛЕКТОРЫ ДЛЯ ВАЛИДАЦИИ =====

/**
 * Селектор проверки валидности корзины
 */
export const selectCartIsValid = createSelector(
  [selectCart, selectCartError],
  (cart: Cart | null, error: string | null): boolean => {
    return !!cart && !error;
  }
);

/**
 * Селектор проверки готовности к оформлению заказа
 */
export const selectCartIsReadyForCheckout = createSelector(
  [selectCartIsValid, selectCartIsEmpty, selectCartLoading, selectCartPartner],
  (
    isValid: boolean,
    isEmpty: boolean,
    isLoading: boolean,
    partner: CartPartner | null
  ): boolean => {
    return isValid && !isEmpty && !isLoading && !!partner;
  }
);
