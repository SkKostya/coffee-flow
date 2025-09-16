// src/store/hooks/useCart.ts
// Основной хук для работы с корзиной

import { useCallback, useEffect, useRef } from 'react';
import type {
  AddCartItemRequest,
  UpdateCartItemRequest,
} from '../../types/cart';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectCart,
  selectCartDisplayData,
  selectCartError,
  selectCartIsEmpty,
  selectCartIsInitialized,
  selectCartIsReadyForCheckout,
  selectCartIsValid,
  selectCartLastUpdated,
  selectCartLoading,
  selectCartMetrics,
  selectCartPartner,
  selectCartTotalAmount,
  selectCartTotalItems,
} from '../selectors/cartSelectors';
import {
  addCartItem,
  clearCart,
  getCartTotal,
  loadCart,
  removeCartItem,
  updateCartItem,
} from '../slices/cartSlice';

/**
 * Основной хук для работы с корзиной
 */
export const useCart = () => {
  const dispatch = useAppDispatch();
  const hasInitialized = useRef(false);

  // ===== СЕЛЕКТОРЫ =====

  const cart = useAppSelector(selectCart);
  const isLoading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const isInitialized = useAppSelector(selectCartIsInitialized);
  const lastUpdated = useAppSelector(selectCartLastUpdated);
  const isReadyForCheckout = useAppSelector(selectCartIsReadyForCheckout);
  const isValid = useAppSelector(selectCartIsValid);
  const isEmpty = useAppSelector(selectCartIsEmpty);
  const partner = useAppSelector(selectCartPartner);
  const totalAmount = useAppSelector(selectCartTotalAmount);
  const totalItems = useAppSelector(selectCartTotalItems);
  const metrics = useAppSelector(selectCartMetrics);
  const displayData = useAppSelector(selectCartDisplayData);

  // ===== ДЕЙСТВИЯ =====

  /**
   * Загрузить корзину
   */
  const loadCartData = useCallback(async () => {
    try {
      await dispatch(loadCart()).unwrap();
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }, [dispatch]);

  /**
   * Добавить товар в корзину
   */
  const addItem = useCallback(
    async (itemData: AddCartItemRequest) => {
      try {
        await dispatch(addCartItem(itemData)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Обновить товар в корзине
   */
  const updateItem = useCallback(
    async (itemId: string, updates: UpdateCartItemRequest) => {
      try {
        await dispatch(updateCartItem({ itemId, updates })).unwrap();
      } catch (error) {
        console.error('Failed to update cart item:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Удалить товар из корзины
   */
  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        await dispatch(removeCartItem(itemId)).unwrap();
      } catch (error) {
        console.error('Failed to remove item from cart:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Очистить корзину
   */
  const clearCartData = useCallback(async () => {
    try {
      await dispatch(clearCart()).unwrap();
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * Обновить общую сумму корзины
   */
  const refreshTotal = useCallback(async () => {
    try {
      await dispatch(getCartTotal()).unwrap();
    } catch (error) {
      console.error('Failed to refresh cart total:', error);
      throw error;
    }
  }, [dispatch]);

  // ===== АВТОМАТИЧЕСКАЯ ЗАГРУЗКА =====

  useEffect(() => {
    if (!isInitialized && !isLoading && !hasInitialized.current) {
      hasInitialized.current = true;
      loadCartData();
    }
  }, [isInitialized, isLoading, loadCartData]);

  // ===== ВОЗВРАЩАЕМЫЕ ДАННЫЕ =====

  return {
    // Данные корзины
    cart,
    items: cart?.items || [],
    partner,
    totalAmount,
    totalItems,
    metrics,
    displayData,

    // Состояния
    isLoading,
    error,
    isInitialized,
    lastUpdated,
    isValid,
    isEmpty,
    isReadyForCheckout,

    // Действия
    loadCart: loadCartData,
    addItem,
    updateItem,
    removeItem,
    clearCart: clearCartData,
    refreshTotal,

    // Утилиты
    hasItems: !isEmpty,
    canCheckout: isReadyForCheckout,
  };
};
