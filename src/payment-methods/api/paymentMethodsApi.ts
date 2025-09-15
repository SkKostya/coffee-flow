// src/payment-methods/api/paymentMethodsApi.ts
import { apiClient } from '../../shared/api';
import type {
  CreatePaymentMethodRequest,
  PaymentMethod,
  PaymentMethodResponse,
  UpdatePaymentMethodRequest,
} from '../../types/payment-methods';

export const paymentMethodsApi = {
  /**
   * Получить все методы оплаты пользователя
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    // Моковые данные для демонстрации
    const mockMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'kaspi',
        name: 'Kaspi',
        isDefault: true,
        isActive: true,
        clientId: 'client-1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '2',
        type: 'card',
        name: 'Банковская карта',
        cardNumber: '1234567890128668',
        cardHolderName: 'Иван Иванов',
        expiryMonth: '12',
        expiryYear: '2025',
        cardBrand: 'visa',
        isDefault: false,
        isActive: true,
        clientId: 'client-1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: '3',
        type: 'cash',
        name: 'Наличные',
        isDefault: false,
        isActive: true,
        clientId: 'client-1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    // Имитируем задержку API
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockMethods;

    // Раскомментируйте для реального API
    // const response = await apiClient.get<PaymentMethodsResponse>(
    //   '/payments/methods'
    // );
    // return response.data;
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
