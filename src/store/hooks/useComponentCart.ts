// src/store/hooks/useComponentCart.ts
// Хук для работы с корзиной в компонентах без API запросов

import { useCallback } from 'react';
import type { AddCartItemRequest } from '../../types/cart';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectCart,
  selectCartError,
  selectCartLoading,
  selectCartTotalAmount,
  selectCartTotalItems,
} from '../selectors/cartSelectors';
import {
  addItemOptimistic,
  removeItemOptimistic,
  updateItemOptimistic,
} from '../slices/cartSlice';

/**
 * Хук для работы с корзиной в компонентах без API запросов
 * Использует только оптимистичные обновления состояния
 */
const useComponentCart = () => {
  const dispatch = useAppDispatch();

  // Селекторы
  const cart = useAppSelector(selectCart);
  const isLoading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const totalItems = useAppSelector(selectCartTotalItems);
  const totalAmount = useAppSelector(selectCartTotalAmount);

  /**
   * Добавляет товар в корзину (оптимистично)
   */
  const addItem = useCallback(
    (request: AddCartItemRequest) => {
      // Создаем объект товара для добавления
      const newItem = {
        id: `${request.productId}-${Date.now()}`, // Временный ID
        productId: request.productId,
        quantity: request.quantity,
        totalPrice: 0, // Будет обновлено при загрузке с сервера
        notes: request.notes || '',
        customizations: request.customizations || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addItemOptimistic(newItem));
    },
    [dispatch]
  );

  /**
   * Обновляет количество товара в корзине (оптимистично)
   */
  const updateItem = useCallback(
    (itemId: string, quantity: number) => {
      if (cart) {
        const item = cart.items.find((item) => item.id === itemId);
        if (item) {
          const updatedItem = {
            ...item,
            quantity,
            updatedAt: new Date().toISOString(),
          };
          dispatch(updateItemOptimistic(updatedItem));
        }
      }
    },
    [dispatch, cart]
  );

  /**
   * Удаляет товар из корзины (оптимистично)
   */
  const removeItem = useCallback(
    (itemId: string) => {
      dispatch(removeItemOptimistic(itemId));
    },
    [dispatch]
  );

  /**
   * Проверяет, есть ли товар в корзине
   */
  const hasItem = useCallback(
    (productId: string): boolean => {
      if (!cart) return false;
      return cart.items.some((item) => item.productId === productId);
    },
    [cart]
  );

  /**
   * Получает количество товара в корзине
   */
  const getItemQuantity = useCallback(
    (productId: string): number => {
      if (!cart) return 0;
      const item = cart.items.find((item) => item.productId === productId);
      return item ? item.quantity : 0;
    },
    [cart]
  );

  /**
   * Получает товар из корзины по productId
   */
  const getItem = useCallback(
    (productId: string) => {
      if (!cart) return null;
      return cart.items.find((item) => item.productId === productId) || null;
    },
    [cart]
  );

  /**
   * Очищает корзину (оптимистично)
   */
  const clearCart = useCallback(() => {
    if (cart && cart.items.length > 0) {
      // Удаляем все товары по одному
      cart.items.forEach((item) => {
        dispatch(removeItemOptimistic(item.id));
      });
    }
  }, [dispatch, cart]);

  /**
   * Получает информацию о корзине
   */
  const getCartInfo = useCallback(() => {
    return {
      items: cart?.items || [],
      totalItems,
      totalAmount,
      isEmpty: totalItems === 0,
      isLoading,
      error,
    };
  }, [cart, totalItems, totalAmount, isLoading, error]);

  return {
    // Данные
    cart,
    items: cart?.items || [],
    totalItems,
    totalAmount,
    isEmpty: totalItems === 0,

    // Состояния
    isLoading,
    error,

    // Действия
    addItem,
    updateItem,
    removeItem,
    clearCart,

    // Утилиты
    hasItem,
    getItemQuantity,
    getItem,
    getCartInfo,
  };
};

export default useComponentCart;
