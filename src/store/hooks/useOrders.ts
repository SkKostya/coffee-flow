// src/store/hooks/useOrders.ts
import { useCallback } from 'react';
import type {
  CreateOrderFromCartRequest,
  CreateOrderRequest,
  GetOrdersParams,
  Order,
  OrderStatus,
} from '../../types/orders';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectCurrentOrder,
  selectOrders,
  selectOrdersCount,
  selectOrdersCreating,
  selectOrdersError,
  selectOrdersErrorDisplay,
  selectOrdersForUI,
  selectOrdersLoading,
  selectOrdersLoadingState,
  selectOrdersStats,
  selectOrdersSummary,
  selectOrdersUpdating,
} from '../selectors/ordersSelectors';
import {
  cancelOrder,
  clearError,
  clearOrders,
  createOrder,
  createOrderFromCart,
  fetchOrderById,
  fetchOrders,
  repeatOrder,
  setCurrentOrder,
  updateOrderStatus,
} from '../slices/ordersSlice';

export const useOrders = () => {
  const dispatch = useAppDispatch();

  // Селекторы
  const orders = useAppSelector(selectOrders);
  const currentOrder = useAppSelector(selectCurrentOrder);
  const isLoading = useAppSelector(selectOrdersLoading);
  const isCreating = useAppSelector(selectOrdersCreating);
  const isUpdating = useAppSelector(selectOrdersUpdating);
  const error = useAppSelector(selectOrdersError);
  const ordersCount = useAppSelector(selectOrdersCount);
  const ordersForUI = useAppSelector(selectOrdersForUI);
  const loadingState = useAppSelector(selectOrdersLoadingState);
  const summary = useAppSelector(selectOrdersSummary);
  const stats = useAppSelector(selectOrdersStats);
  const errorDisplay = useAppSelector(selectOrdersErrorDisplay);

  // Действия
  const loadOrders = useCallback(
    (params?: GetOrdersParams) => {
      dispatch(fetchOrders(params));
    },
    [dispatch]
  );

  const loadOrderById = useCallback(
    (orderId: string) => {
      dispatch(fetchOrderById(orderId));
    },
    [dispatch]
  );

  const createNewOrder = useCallback(
    (data: CreateOrderRequest) => {
      return dispatch(createOrder(data));
    },
    [dispatch]
  );

  const createNewOrderFromCart = useCallback(
    (data: CreateOrderFromCartRequest) => {
      return dispatch(createOrderFromCart(data));
    },
    [dispatch]
  );

  const updateStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      dispatch(updateOrderStatus({ orderId, status }));
    },
    [dispatch]
  );

  const cancel = useCallback(
    (orderId: string) => {
      dispatch(cancelOrder(orderId));
    },
    [dispatch]
  );

  const repeat = useCallback(
    (orderId: string) => {
      return dispatch(repeatOrder(orderId));
    },
    [dispatch]
  );

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setCurrent = useCallback(
    (order: Order | null) => {
      dispatch(setCurrentOrder(order));
    },
    [dispatch]
  );

  const clear = useCallback(() => {
    dispatch(clearOrders());
  }, [dispatch]);

  // Селекторы с параметрами
  const getOrdersByStatus = useCallback(
    (status: OrderStatus) => {
      return orders.filter((order) => order.status === status);
    },
    [orders]
  );

  const getRecentOrders = useCallback(
    (limit: number = 5) => {
      return [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, limit);
    },
    [orders]
  );

  const getOrderById = useCallback(
    (orderId: string) => {
      return orders.find((order) => order.id === orderId);
    },
    [orders]
  );

  const getOrdersByPartner = useCallback(
    (partnerId: string) => {
      return orders.filter((order) => order.partnerId === partnerId);
    },
    [orders]
  );

  return {
    // Данные
    orders,
    currentOrder,
    ordersForUI,
    ordersCount,
    summary,
    stats,
    errorDisplay,

    // Состояния загрузки
    isLoading,
    isCreating,
    isUpdating,
    loadingState,
    error,

    // Действия
    loadOrders,
    loadOrderById,
    createOrder: createNewOrder,
    createOrderFromCart: createNewOrderFromCart,
    updateOrderStatus: updateStatus,
    cancelOrder: cancel,
    repeatOrder: repeat,
    clearError: clearErrorState,
    setCurrentOrder: setCurrent,
    clearOrders: clear,

    // Селекторы с параметрами
    getOrdersByStatus,
    getRecentOrders,
    getOrderById,
    getOrdersByPartner,
  };
};
