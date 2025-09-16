import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Базовые селекторы
export const selectStickyCartState = (state: RootState) =>
  state.stickyCart || {
    isVisible: false,
    selectedProducts: [],
    totalAmount: 0,
    totalItems: 0,
  };

export const selectStickyCartVisibility = (state: RootState) =>
  state.stickyCart?.isVisible || false;

export const selectStickyCartSelectedProducts = (state: RootState) =>
  state.stickyCart?.selectedProducts || [];

export const selectStickyCartProductQuantities = (state: RootState) =>
  state.stickyCart?.productQuantities || {};

export const selectStickyCartProductPrices = (state: RootState) =>
  state.stickyCart?.productPrices || {};

export const selectStickyCartTotalAmount = (state: RootState) =>
  state.stickyCart?.totalAmount || 0;

export const selectStickyCartTotalItems = (state: RootState) =>
  state.stickyCart?.totalItems || 0;

export const selectStickyCartIsEmpty = (state: RootState) =>
  (state.stickyCart?.totalItems || 0) === 0;

// Мемоизированные селекторы
export const selectStickyCartInfo = createSelector(
  [selectStickyCartState],
  (stickyCart) => ({
    isVisible: stickyCart.isVisible || false,
    selectedProducts: stickyCart.selectedProducts || [],
    totalAmount: stickyCart.totalAmount || 0,
    totalItems: stickyCart.totalItems || 0,
    isEmpty: (stickyCart.totalItems || 0) === 0,
  })
);

export const selectIsProductInStickyCart = createSelector(
  [
    selectStickyCartSelectedProducts,
    (state: RootState, productId: string) => productId,
  ],
  (selectedProducts, productId) => (selectedProducts || []).includes(productId)
);
