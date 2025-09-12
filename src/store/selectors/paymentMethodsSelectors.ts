// src/store/selectors/paymentMethodsSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import type { PaymentMethod } from '../../types/payment-methods';
import { RootState } from '../index';

// Базовые селекторы
export const selectPaymentMethodsState = (state: RootState) =>
  state.paymentMethods;

export const selectPaymentMethods = (state: RootState) =>
  state.paymentMethods.methods;

export const selectPaymentMethodsLoading = (state: RootState) =>
  state.paymentMethods.isLoading;

export const selectPaymentMethodsError = (state: RootState) =>
  state.paymentMethods.error;

export const selectPaymentMethodsCreating = (state: RootState) =>
  state.paymentMethods.isCreating;

export const selectPaymentMethodsUpdating = (state: RootState) =>
  state.paymentMethods.isUpdating;

export const selectPaymentMethodsDeleting = (state: RootState) =>
  state.paymentMethods.isDeleting;

export const selectPaymentMethodsSettingDefault = (state: RootState) =>
  state.paymentMethods.isSettingDefault;

// Мемоизированные селекторы
export const selectDefaultPaymentMethod = createSelector(
  [selectPaymentMethods],
  (methods) => methods.find((method) => method.isDefault) || null
);

export const selectActivePaymentMethods = createSelector(
  [selectPaymentMethods],
  (methods) => methods.filter((method) => method.isActive)
);

export const selectPaymentMethodsCount = createSelector(
  [selectPaymentMethods],
  (methods) => methods.length
);

export const selectActivePaymentMethodsCount = createSelector(
  [selectActivePaymentMethods],
  (methods) => methods.length
);

export const selectPaymentMethodsByBrand = createSelector(
  [selectPaymentMethods],
  (methods) => {
    const grouped = methods.reduce((acc, method) => {
      const brand = method.cardBrand;
      if (!acc[brand]) {
        acc[brand] = [];
      }
      acc[brand].push(method);
      return acc;
    }, {} as Record<string, PaymentMethod[]>);

    return grouped;
  }
);

export const selectPaymentMethodById = (id: string) =>
  createSelector(
    [selectPaymentMethods],
    (methods) => methods.find((method) => method.id === id) || null
  );

export const selectPaymentMethodsInfo = createSelector(
  [
    selectPaymentMethods,
    selectPaymentMethodsLoading,
    selectPaymentMethodsError,
    selectDefaultPaymentMethod,
    selectActivePaymentMethodsCount,
  ],
  (methods, isLoading, error, defaultMethod, activeCount) => ({
    hasMethods: methods.length > 0,
    hasDefaultMethod: !!defaultMethod,
    activeCount,
    totalCount: methods.length,
    isLoading,
    error,
    isEmpty: methods.length === 0,
  })
);

export const selectPaymentMethodsLoadingStates = createSelector(
  [
    selectPaymentMethodsLoading,
    selectPaymentMethodsCreating,
    selectPaymentMethodsUpdating,
    selectPaymentMethodsDeleting,
    selectPaymentMethodsSettingDefault,
  ],
  (isLoading, isCreating, isUpdating, isDeleting, isSettingDefault) => ({
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isSettingDefault,
    isAnyLoading:
      isLoading || isCreating || isUpdating || isDeleting || isSettingDefault,
  })
);
