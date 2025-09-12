// src/store/hooks/usePaymentMethods.ts
import { useCallback } from 'react';
import type {
  CreatePaymentMethodRequest,
  PaymentMethodActions,
  PaymentMethodId,
  UpdatePaymentMethodRequest,
} from '../../types/payment-methods';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectActivePaymentMethods,
  selectActivePaymentMethodsCount,
  selectDefaultPaymentMethod,
  selectPaymentMethods,
  selectPaymentMethodsCount,
  selectPaymentMethodsInfo,
  selectPaymentMethodsLoadingStates,
} from '../selectors/paymentMethodsSelectors';
import {
  clearError,
  clearPaymentMethods,
  createPaymentMethod,
  deletePaymentMethod,
  fetchPaymentMethods,
  setDefaultPaymentMethod,
  updatePaymentMethod,
} from '../slices/paymentMethodsSlice';

export const usePaymentMethods = (): PaymentMethodActions & {
  methods: ReturnType<typeof selectPaymentMethods>;
  defaultMethod: ReturnType<typeof selectDefaultPaymentMethod>;
  activeMethods: ReturnType<typeof selectActivePaymentMethods>;
  methodsCount: ReturnType<typeof selectPaymentMethodsCount>;
  activeMethodsCount: ReturnType<typeof selectActivePaymentMethodsCount>;
  info: ReturnType<typeof selectPaymentMethodsInfo>;
  loadingStates: ReturnType<typeof selectPaymentMethodsLoadingStates>;
  clearPaymentMethods: () => void;
} => {
  const dispatch = useAppDispatch();

  // Селекторы
  const methods = useAppSelector(selectPaymentMethods);
  const defaultMethod = useAppSelector(selectDefaultPaymentMethod);
  const activeMethods = useAppSelector(selectActivePaymentMethods);
  const methodsCount = useAppSelector(selectPaymentMethodsCount);
  const activeMethodsCount = useAppSelector(selectActivePaymentMethodsCount);
  const info = useAppSelector(selectPaymentMethodsInfo);
  const loadingStates = useAppSelector(selectPaymentMethodsLoadingStates);

  // Действия
  const loadPaymentMethods = useCallback(async () => {
    try {
      await dispatch(fetchPaymentMethods()).unwrap();
    } catch (error) {
      // Ошибка обрабатывается в slice
      console.error('Failed to load payment methods:', error);
    }
  }, [dispatch]);

  const createPaymentMethodAction = useCallback(
    async (data: CreatePaymentMethodRequest) => {
      try {
        await dispatch(createPaymentMethod(data)).unwrap();
      } catch (error) {
        // Ошибка обрабатывается в slice
        console.error('Failed to create payment method:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const updatePaymentMethodAction = useCallback(
    async (id: PaymentMethodId, data: UpdatePaymentMethodRequest) => {
      try {
        await dispatch(updatePaymentMethod({ id, data })).unwrap();
      } catch (error) {
        // Ошибка обрабатывается в slice
        console.error('Failed to update payment method:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const deletePaymentMethodAction = useCallback(
    async (id: PaymentMethodId) => {
      try {
        await dispatch(deletePaymentMethod(id)).unwrap();
      } catch (error) {
        // Ошибка обрабатывается в slice
        console.error('Failed to delete payment method:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const setDefaultPaymentMethodAction = useCallback(
    async (id: PaymentMethodId) => {
      try {
        await dispatch(setDefaultPaymentMethod(id)).unwrap();
      } catch (error) {
        // Ошибка обрабатывается в slice
        console.error('Failed to set default payment method:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearPaymentMethodsAction = useCallback(() => {
    dispatch(clearPaymentMethods());
  }, [dispatch]);

  return {
    // Данные
    methods,
    defaultMethod,
    activeMethods,
    methodsCount,
    activeMethodsCount,
    info,
    loadingStates,

    // Действия
    loadPaymentMethods,
    createPaymentMethod: createPaymentMethodAction,
    updatePaymentMethod: updatePaymentMethodAction,
    deletePaymentMethod: deletePaymentMethodAction,
    setDefaultPaymentMethod: setDefaultPaymentMethodAction,
    clearError: clearErrorAction,
    clearPaymentMethods: clearPaymentMethodsAction,
  };
};
