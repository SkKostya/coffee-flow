// src/store/hooks/useStickyCartToCart.ts
// Хук для добавления товаров из sticky cart в основную корзину

import { useCallback } from 'react';
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
  const { addItem, isLoading: cartLoading, error: cartError } = useCart();
  const {
    clear,
    hide,
    totalItems: stickyTotalItems,
    totalAmount: stickyTotalAmount,
  } = useStickyCart();

  const selectedProducts = useAppSelector(selectStickyCartSelectedProducts);
  const productQuantities = useAppSelector(selectStickyCartProductQuantities);

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

      // Добавляем товары по одному
      const results = [];
      for (const item of cartItems) {
        try {
          await addItem(item);
          results.push({ success: true, item });
        } catch (error) {
          results.push({ success: false, item, error });
        }
      }

      // Проверяем, есть ли успешно добавленные товары
      const successfulItems = results.filter((r) => r.success);
      if (successfulItems.length === 0) {
        throw new Error('Не удалось добавить ни одного товара в корзину');
      }

      // Очищаем sticky cart только если все товары добавлены успешно
      if (successfulItems.length === cartItems.length) {
        clear();
        hide();
      }

      return {
        success: results.every((r) => r.success),
        itemsCount: successfulItems.length,
        totalItems: cartItems.length,
        failedItems: results.filter((r) => !r.success).length,
      };
    } catch (error) {
      console.error('Failed to add sticky cart items to cart:', error);
      throw error;
    }
  }, [
    selectedProducts,
    productQuantities,
    convertStickyProductsToCartItems,
    addItem,
    clear,
    hide,
  ]);

  /**
   * Проверяет, можно ли добавить товары в корзину
   */
  const canAddToCart = useCallback((): boolean => {
    return selectedProducts.length > 0 && !cartLoading;
  }, [selectedProducts.length, cartLoading]);

  /**
   * Получает информацию о товарах для добавления
   */
  const getAddToCartInfo = useCallback(() => {
    return {
      itemsCount: selectedProducts.length,
      totalItems: stickyTotalItems,
      totalAmount: stickyTotalAmount,
      canAdd: canAddToCart(),
      isLoading: cartLoading,
      error: cartError,
    };
  }, [
    selectedProducts.length,
    stickyTotalItems,
    stickyTotalAmount,
    canAddToCart,
    cartLoading,
    cartError,
  ]);

  return {
    // Данные
    selectedProducts,
    productQuantities,

    // Состояния
    isLoading: cartLoading,
    error: cartError,
    canAddToCart: canAddToCart(),

    // Действия
    addStickyCartToCart,
    convertStickyProductsToCartItems,

    // Утилиты
    getAddToCartInfo,
  };
};

export default useStickyCartToCart;
