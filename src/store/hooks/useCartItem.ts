// src/store/hooks/useCartItem.ts
// Хук для работы с отдельным товаром корзины

import { useCallback } from 'react';
import type { UpdateCartItemRequest } from '../../types/cart';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectCartItemById,
  selectItemLoadingState,
} from '../selectors/cartSelectors';
import {
  clearItemLoading,
  removeCartItem,
  setItemLoading,
  updateCartItem,
} from '../slices/cartSlice';

interface UseCartItemParams {
  itemId: string;
}

/**
 * Хук для работы с отдельным товаром корзины
 */
export const useCartItem = ({ itemId }: UseCartItemParams) => {
  const dispatch = useAppDispatch();

  // ===== СЕЛЕКТОРЫ =====

  const item = useAppSelector((state) => selectCartItemById(state, itemId));
  const isLoading = useAppSelector((state) =>
    selectItemLoadingState(state, itemId)
  );

  // ===== ДЕЙСТВИЯ =====

  /**
   * Обновить товар
   */
  const updateItem = useCallback(
    async (updates: UpdateCartItemRequest) => {
      dispatch(setItemLoading({ itemId, isLoading: true }));
      try {
        await dispatch(updateCartItem({ itemId, updates })).unwrap();
      } catch (error) {
        console.error('Failed to update cart item:', error);
        throw error;
      } finally {
        dispatch(clearItemLoading(itemId));
      }
    },
    [dispatch, itemId]
  );

  /**
   * Удалить товар
   */
  const removeItem = useCallback(async () => {
    dispatch(setItemLoading({ itemId, isLoading: true }));
    try {
      await dispatch(removeCartItem(itemId)).unwrap();
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      throw error;
    } finally {
      dispatch(clearItemLoading(itemId));
    }
  }, [dispatch, itemId]);

  /**
   * Изменить количество товара
   */
  const updateQuantity = useCallback(
    async (quantity: number) => {
      if (quantity <= 0) {
        await removeItem();
        return;
      }

      await updateItem({ quantity });
    },
    [updateItem, removeItem]
  );

  /**
   * Увеличить количество на 1
   */
  const incrementQuantity = useCallback(async () => {
    if (item) {
      await updateQuantity(item.quantity + 1);
    }
  }, [item, updateQuantity]);

  /**
   * Уменьшить количество на 1
   */
  const decrementQuantity = useCallback(async () => {
    if (item) {
      await updateQuantity(item.quantity - 1);
    }
  }, [item, updateQuantity]);

  /**
   * Обновить примечания
   */
  const updateNotes = useCallback(
    async (notes: string) => {
      await updateItem({ notes });
    },
    [updateItem]
  );

  /**
   * Обновить кастомизации
   */
  const updateCustomizations = useCallback(
    async (customizations: Record<string, string | boolean>) => {
      await updateItem({ customizations });
    },
    [updateItem]
  );

  // ===== ВОЗВРАЩАЕМЫЕ ДАННЫЕ =====

  return {
    // Данные товара
    item,
    isInCart: !!item,
    isLoading,

    // Действия
    updateItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    updateNotes,
    updateCustomizations,

    // Утилиты
    totalPrice: item ? item.totalPrice * item.quantity : 0,
    unitPrice: item?.unitPrice || 0,
    quantity: item?.quantity || 0,
    notes: item?.notes || '',
    customizations: item?.customizations || {},
  };
};
