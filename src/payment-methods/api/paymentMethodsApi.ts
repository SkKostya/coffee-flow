// src/payment-methods/api/paymentMethodsApi.ts
import { apiClient } from '../../shared/api';
import type {
  CreatePaymentMethodRequest,
  PaymentMethod,
  PaymentMethodResponse,
  PaymentMethodsResponse,
  UpdatePaymentMethodRequest,
} from '../../types/payment-methods';

export const paymentMethodsApi = {
  /**
   * Получить все методы оплаты пользователя
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiClient.get<PaymentMethodsResponse>(
      '/payments/methods'
    );
    return response.data;
  },

  /**
   * Создать новый метод оплаты
   */
  async createPaymentMethod(
    data: CreatePaymentMethodRequest
  ): Promise<PaymentMethod> {
    const response = await apiClient.post<PaymentMethodResponse>(
      '/payments/methods',
      data
    );
    return response.data;
  },

  /**
   * Обновить метод оплаты
   */
  async updatePaymentMethod(
    methodId: string,
    data: UpdatePaymentMethodRequest
  ): Promise<PaymentMethod> {
    const response = await apiClient.put<PaymentMethodResponse>(
      `/payments/methods/${methodId}`,
      data
    );
    return response.data;
  },

  /**
   * Удалить метод оплаты
   */
  async deletePaymentMethod(methodId: string): Promise<void> {
    await apiClient.delete(`/payments/methods/${methodId}`);
  },

  /**
   * Установить метод оплаты по умолчанию
   */
  async setDefaultPaymentMethod(methodId: string): Promise<PaymentMethod> {
    const response = await apiClient.put<PaymentMethodResponse>(
      `/payments/methods/${methodId}/default`
    );
    return response.data;
  },
};
