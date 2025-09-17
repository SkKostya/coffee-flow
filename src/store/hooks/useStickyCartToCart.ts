// src/store/hooks/useStickyCartToCart.ts
// Хук для добавления товаров из sticky cart в основную корзину

import { useCallback } from 'react';
import type { AddCartItemRequest } from '../../types/cart';
import { useAppSelector } from '../hooks';
import {
  selectStickyCartProductQuantities,
  selectStickyCartSelectedProducts,
} from '../selectors/stickyCartSelectors';
import useComponentCart from './useComponentCart';
import { useStickyCart } from './useStickyCart';

/**
 * Хук для добавления товаров из sticky cart в основную корзину
 */
const useStickyCartToCart = () => {
  const { addItem } = useComponentCart();
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
  const addStickyCartToCart = useCallback(() => {
    try {
      if (selectedProducts.length === 0) {
        throw new Error('Нет товаров для добавления в корзину');
      }

      const cartItems = convertStickyProductsToCartItems();

      if (cartItems.length === 0) {
        throw new Error('Нет валидных товаров для добавления в корзину');
      }

      // Добавляем товары синхронно (оптимистично)
      cartItems.forEach((item) => {
        addItem(item);
      });

      // Очищаем sticky cart после успешного добавления
      clear();
      hide();

      return {
        success: true,
        itemsCount: cartItems.length,
        totalItems: cartItems.length,
        failedItems: 0,
      };
    } catch (error) {
      console.error('Failed to add sticky cart items to cart:', error);
      throw error;
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
   * Получает информацию о товарах для добавления
   */
  const getAddToCartInfo = useCallback(() => {
    return {
      itemsCount: selectedProducts.length,
      totalItems: stickyTotalItems,
      totalAmount: stickyTotalAmount,
      canAdd: canAddToCart(),
      isLoading: false, // Теперь синхронная операция
      error: null, // Ошибки обрабатываются локально
    };
  }, [
    selectedProducts.length,
    stickyTotalItems,
    stickyTotalAmount,
    canAddToCart,
  ]);

  return {
    // Данные
    selectedProducts,
    productQuantities,

    // Состояния
    isLoading: false, // Синхронная операция
    error: null, // Ошибки обрабатываются локально
    canAddToCart: canAddToCart(),

    // Действия
    addStickyCartToCart,
    convertStickyProductsToCartItems,

    // Утилиты
    getAddToCartInfo,
  };
};

export default useStickyCartToCart;
