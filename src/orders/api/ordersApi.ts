// src/orders/api/ordersApi.ts
import { apiClient } from '../../shared/api';
import type {
  CreateOrderFromCartRequest,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrdersParams,
  GetOrdersResponse,
  RepeatOrderResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from '../../types/orders';

export const ordersApi = {
  /**
   * Получить все заказы для аутентифицированного клиента
   */
  async getOrders(params?: GetOrdersParams): Promise<GetOrdersResponse[]> {
    const response = await apiClient.get<GetOrdersResponse[]>('/orders', {
      params: params as Record<string, unknown>,
    });
    return response.data || [];
  },

  /**
   * Получить конкретный заказ по ID
   */
  async getOrderById(orderId: string): Promise<GetOrdersResponse> {
    const response = await apiClient.get<GetOrdersResponse>(
      `/orders/${orderId}`
    );
    if (!response.data) {
      throw new Error('Заказ не найден');
    }
    return response.data;
  },

  /**
   * Создать новый заказ с конкретными товарами и партнером
   */
  async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await apiClient.post<CreateOrderResponse>('/orders', data);
    if (!response.data) {
      throw new Error('Ошибка создания заказа');
    }
    return response.data;
  },

  /**
   * Создать новый заказ используя товары из корзины клиента
   */
  async createOrderFromCart(
    data: CreateOrderFromCartRequest
  ): Promise<CreateOrderResponse> {
    const response = await apiClient.post<CreateOrderResponse>(
      '/orders/from-cart',
      data
    );
    if (!response.data) {
      throw new Error('Ошибка создания заказа из корзины');
    }
    return response.data;
  },

  /**
   * Обновить статус существующего заказа
   */
  async updateOrderStatus(
    orderId: string,
    data: UpdateOrderStatusRequest
  ): Promise<UpdateOrderStatusResponse> {
    const response = await apiClient.put<UpdateOrderStatusResponse>(
      `/orders/${orderId}/status`,
      data
    );
    if (!response.data) {
      throw new Error('Ошибка обновления статуса заказа');
    }
    return response.data;
  },

  /**
   * Отменить существующий заказ (если не доставлен)
   */
  async cancelOrder(orderId: string): Promise<UpdateOrderStatusResponse> {
    const response = await apiClient.put<UpdateOrderStatusResponse>(
      `/orders/${orderId}/cancel`
    );
    if (!response.data) {
      throw new Error('Ошибка отмены заказа');
    }
    return response.data;
  },

  /**
   * Создать новый заказ с теми же товарами, что и существующий заказ
   */
  async repeatOrder(orderId: string): Promise<RepeatOrderResponse> {
    const response = await apiClient.post<RepeatOrderResponse>(
      `/orders/${orderId}/repeat`
    );
    if (!response.data) {
      throw new Error('Ошибка повторения заказа');
    }
    return response.data;
  },
};
