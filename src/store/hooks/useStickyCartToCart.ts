// src/store/hooks/useStickyCartToCart.ts
// Хук для добавления товаров из sticky cart в основную корзину

import { useCallback, useMemo, useState } from 'react';
import type { AddCartItemRequest } from '../../types/cart';
import { useAppSelector } from '../hooks';
import {
  selectStickyCartProductQuantities,
  selectStickyCartSelectedProducts,
} from '../selectors/stickyCartSelectors';
import { useCart } from './useCart';
import { useStickyCart } from './useStickyCart';

/**
 * Хук для добавления товаров из sticky cart в основную корзину
 */
const useStickyCartToCart = () => {
  const { addItem } = useCart();
  const {
    clear,
    hide,
    totalItems: stickyTotalItems,
    totalAmount: stickyTotalAmount,
  } = useStickyCart();

  const selectedProducts = useAppSelector(selectStickyCartSelectedProducts);
  const productQuantities = useAppSelector(selectStickyCartProductQuantities);

  // Состояния для отслеживания процесса добавления
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Преобразует товары из sticky cart в формат для добавления в корзину
   */
  const convertStickyProductsToCartItems =
    useCallback((): AddCartItemRequest[] => {
      return selectedProducts
        .filter((productId: string) => {
          // Фильтруем пустые или невалидные ID
          const isValid =
            productId &&
            typeof productId === 'string' &&
            productId.trim() !== '';
          if (!isValid) {
            console.warn('Invalid product ID found:', productId);
          }
          return isValid;
        })
        .map((productId: string) => {
          const quantity = productQuantities[productId] || 1;

          const cartItem = {
            productId: productId.trim(),
            quantity,
            // Пока не передаем notes и customizations, так как они не хранятся в sticky cart
            // В будущем можно добавить их хранение в sticky cart state
          };

          return cartItem;
        });
    }, [selectedProducts, productQuantities]);

  /**
   * Добавляет все выбранные товары из sticky cart в основную корзину
   */
  const addStickyCartToCart = useCallback(async () => {
    try {
      if (selectedProducts.length === 0) {
        throw new Error('Нет товаров для добавления в корзину');
      }

      const cartItems = convertStickyProductsToCartItems();

      if (cartItems.length === 0) {
        throw new Error('Нет валидных товаров для добавления в корзину');
      }

      setIsLoading(true);
      setError(null);

      // Добавляем товары асинхронно через API
      const results = await Promise.allSettled(
        cartItems.map((item) => addItem(item))
      );

      // Подсчитываем результаты
      const successfulItems = results.filter(
        (result) => result.status === 'fulfilled'
      ).length;
      const failedItems = results.filter(
        (result) => result.status === 'rejected'
      ).length;

      // Очищаем sticky cart только если хотя бы один товар был добавлен
      if (successfulItems > 0) {
        clear();
        hide();
      }

      return {
        success: successfulItems > 0,
        itemsCount: successfulItems,
        totalItems: cartItems.length,
        failedItems,
      };
    } catch (error) {
      console.error('Failed to add sticky cart items to cart:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedProducts,
    convertStickyProductsToCartItems,
    addItem,
    clear,
    hide,
  ]);

  /**
   * Проверяет, можно ли добавить товары в корзину
   */
  const canAddToCart = useCallback((): boolean => {
    return selectedProducts.length > 0;
  }, [selectedProducts.length]);

  /**
   * Получает информацию о товарах для добавления (мемоизированно)
   */
  const getAddToCartInfo = useMemo(() => {
    return {
      itemsCount: selectedProducts.length,
      totalItems: stickyTotalItems,
      totalAmount: stickyTotalAmount,
      canAdd: selectedProducts.length > 0,
      isLoading,
      error,
    };
  }, [
    selectedProducts.length,
    stickyTotalItems,
    stickyTotalAmount,
    isLoading,
    error,
  ]);

  return {
    // Данные
    selectedProducts,
    productQuantities,

    // Состояния
    isLoading,
    error,
    canAddToCart: canAddToCart(),

    // Действия
    addStickyCartToCart,
    convertStickyProductsToCartItems,

    // Утилиты
    getAddToCartInfo,
  };
};

export default useStickyCartToCart;
