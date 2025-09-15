// src/store/selectors/ordersSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import type { OrderCardData, OrderStatus } from '../../types/orders';
import type { RootState } from '../store';

// Базовые селекторы
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.isLoading;
export const selectOrdersCreating = (state: RootState) =>
  state.orders.isCreating;
export const selectOrdersUpdating = (state: RootState) =>
  state.orders.isUpdating;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectLastFetchTime = (state: RootState) =>
  state.orders.lastFetchTime;

// Мемоизированные селекторы
export const selectOrdersCount = createSelector(
  [selectOrders],
  (orders) => orders.length
);

export const selectOrdersByStatus = createSelector(
  [selectOrders, (state: RootState, status: OrderStatus) => status],
  (orders, status) => orders.filter((order) => order.status === status)
);

export const selectRecentOrders = createSelector(
  [selectOrders, (state: RootState, limit: number = 5) => limit],
  (orders, limit) =>
    [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit)
);

export const selectOrdersForUI = createSelector(
  [selectOrders],
  (orders): OrderCardData[] =>
    orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      partner: {
        name: order.partner.name,
        address: order.partner.address,
        logo: order.partner.logo,
      },
      items: order.items.map((item) => item.product.name),
    }))
);

export const selectOrderById = createSelector(
  [selectOrders, (state: RootState, orderId: string) => orderId],
  (orders, orderId) => orders.find((order) => order.id === orderId)
);

export const selectOrdersLoadingState = createSelector(
  [selectOrdersLoading, selectOrdersCreating, selectOrdersUpdating],
  (isLoading, isCreating, isUpdating) => ({
    fetchOrders: isLoading,
    createOrder: isCreating,
    updateOrderStatus: isUpdating,
    repeatOrder: isCreating,
    cancelOrder: isUpdating,
  })
);

export const selectOrdersSummary = createSelector(
  [selectOrders, selectOrdersLoading, selectOrdersError],
  (orders, isLoading, error) => ({
    totalOrders: orders.length,
    isLoading,
    hasError: !!error,
    errorMessage: error?.message,
    lastOrder: orders.length > 0 ? orders[0] : null,
  })
);

export const selectOrdersByPartner = createSelector(
  [selectOrders, (state: RootState, partnerId: string) => partnerId],
  (orders, partnerId) => orders.filter((order) => order.partnerId === partnerId)
);

export const selectOrdersStats = createSelector([selectOrders], (orders) => {
  const stats = {
    total: orders.length,
    byStatus: {
      received: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
      cancelled: 0,
    },
    totalAmount: 0,
    averageAmount: 0,
  };

  orders.forEach((order) => {
    stats.byStatus[order.status]++;
    stats.totalAmount += order.totalAmount;
  });

  stats.averageAmount = stats.total > 0 ? stats.totalAmount / stats.total : 0;

  return stats;
});

export const selectOrdersWithPartner = createSelector(
  [selectOrders],
  (orders) => orders.filter((order) => order.partner)
);

export const selectOrdersErrorDisplay = createSelector(
  [selectOrdersError],
  (error) => {
    if (!error) return null;

    return {
      title: 'Ошибка загрузки заказов',
      message: error.message,
      code: error.code,
      timestamp: error.timestamp,
    };
  }
);
