// src/cart/api/cartApi.ts
// API сервис для корзины

import { ProtectedApiClient } from '../../shared/api/ProtectedApiClient';
import type {
  AddCartItemRequest,
  AddCartItemResponse,
  ClearCartResponse,
  DeleteCartItemResponse,
  GetCartResponse,
  GetCartTotalResponse,
  UpdateCartItemRequest,
  UpdateCartItemResponse,
} from '../../types/cart';
import type {
  CartApiClient,
  CartApiError,
  DeleteCartItemParams,
  UpdateCartItemParams,
} from '../types/api';

class CartApiService implements CartApiClient {
  private apiClient: ProtectedApiClient;

  constructor() {
    this.apiClient = new ProtectedApiClient();
  }

  // ===== ОСНОВНЫЕ API МЕТОДЫ =====

  /**
   * Получить корзину пользователя
   */
  async getCart(): Promise<GetCartResponse> {
    try {
      const response = await this.apiClient.get<GetCartResponse>('/cart');
      return response.data!;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Добавить товар в корзину
   */
  async addCartItem(data: AddCartItemRequest): Promise<AddCartItemResponse> {
    try {
      // Валидация данных
      this.validateAddItemData(data);

      const response = await this.apiClient.post<AddCartItemResponse>(
        '/cart/items',
        data
      );
      return response.data!;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Обновить товар в корзине
   */
  async updateCartItem(
    params: UpdateCartItemParams,
    data: UpdateCartItemRequest
  ): Promise<UpdateCartItemResponse> {
    try {
      // Валидация данных
      this.validateUpdateItemData(data);
      this.validateItemId(params.itemId);

      const response = await this.apiClient.put<UpdateCartItemResponse>(
        `/cart/items/${params.itemId}`,
        data
      );
      return response.data!;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Удалить товар из корзины
   */
  async deleteCartItem(
    params: DeleteCartItemParams
  ): Promise<DeleteCartItemResponse> {
    try {
      // Валидация ID товара
      this.validateItemId(params.itemId);

      const response = await this.apiClient.delete<DeleteCartItemResponse>(
        `/cart/items/${params.itemId}`
      );
      return response.data!;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Получить общую сумму корзины
   */
  async getCartTotal(): Promise<GetCartTotalResponse> {
    try {
      const response = await this.apiClient.get<GetCartTotalResponse>(
        '/cart/total'
      );
      return response.data!;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  /**
   * Очистить корзину
   */
  async clearCart(): Promise<ClearCartResponse> {
    try {
      const response = await this.apiClient.delete<ClearCartResponse>('/cart');
      return response.data!;
    } catch (error) {
      throw this.handleApiError(error);
    }
  }

  // ===== ВАЛИДАЦИЯ ДАННЫХ =====

  /**
   * Валидация данных для добавления товара
   */
  private validateAddItemData(data: AddCartItemRequest): void {
    if (!data.productId || typeof data.productId !== 'string') {
      throw new Error('Product ID is required and must be a string');
    }

    if (
      !data.quantity ||
      typeof data.quantity !== 'number' ||
      data.quantity <= 0
    ) {
      throw new Error('Quantity is required and must be a positive number');
    }

    if (data.quantity > 99) {
      throw new Error('Quantity cannot exceed 99');
    }

    if (data.notes && data.notes.length > 500) {
      throw new Error('Notes cannot exceed 500 characters');
    }

    if (data.customizations) {
      this.validateCustomizations(data.customizations);
    }
  }

  /**
   * Валидация данных для обновления товара
   */
  private validateUpdateItemData(data: UpdateCartItemRequest): void {
    if (data.quantity !== undefined) {
      if (typeof data.quantity !== 'number' || data.quantity <= 0) {
        throw new Error('Quantity must be a positive number');
      }
      if (data.quantity > 99) {
        throw new Error('Quantity cannot exceed 99');
      }
    }

    if (data.notes !== undefined && data.notes.length > 500) {
      throw new Error('Notes cannot exceed 500 characters');
    }

    if (data.customizations) {
      this.validateCustomizations(data.customizations);
    }
  }

  /**
   * Валидация ID товара
   */
  private validateItemId(itemId: string): void {
    if (!itemId || typeof itemId !== 'string') {
      throw new Error('Item ID is required and must be a string');
    }

    // Проверка формата UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(itemId)) {
      throw new Error('Item ID must be a valid UUID');
    }
  }

  /**
   * Валидация кастомизаций
   */
  private validateCustomizations(
    customizations: Record<string, string | boolean | undefined>
  ): void {
    const maxCustomizations = 10;
    const customizationsCount = Object.keys(customizations).length;

    if (customizationsCount > maxCustomizations) {
      throw new Error(
        `Cannot have more than ${maxCustomizations} customizations`
      );
    }

    for (const [key, value] of Object.entries(customizations)) {
      if (typeof key !== 'string' || key.length === 0) {
        throw new Error('Customization keys must be non-empty strings');
      }

      if (typeof value !== 'string' && typeof value !== 'boolean') {
        throw new Error('Customization values must be strings or booleans');
      }

      if (typeof value === 'string' && value.length > 100) {
        throw new Error(
          'Customization string values cannot exceed 100 characters'
        );
      }
    }
  }

  // ===== ОБРАБОТКА ОШИБОК =====

  /**
   * Обработка API ошибок
   */
  private handleApiError(error: unknown): CartApiError {
    if (this.isApiError(error)) {
      return {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'Произошла неизвестная ошибка',
        details: error.details,
        statusCode: error.statusCode || 500,
      };
    }

    if (error instanceof Error) {
      return {
        code: 'CLIENT_ERROR',
        message: error.message,
        statusCode: 0,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'Произошла неизвестная ошибка',
      statusCode: 0,
    };
  }

  /**
   * Проверка, является ли ошибка API ошибкой
   */
  private isApiError(error: unknown): error is CartApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'message' in error &&
      'statusCode' in error
    );
  }

  // ===== УТИЛИТАРНЫЕ МЕТОДЫ =====

  /**
   * Проверка, можно ли повторить запрос
   */
  isRetryableError(error: CartApiError): boolean {
    const retryableCodes = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'SERVER_ERROR',
      'SERVICE_UNAVAILABLE',
    ];

    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];

    return (
      retryableCodes.includes(error.code) ||
      retryableStatusCodes.includes(error.statusCode)
    );
  }

  /**
   * Получение сообщения об ошибке для пользователя
   */
  getErrorMessage(error: CartApiError): string {
    const errorMessages: Record<string, string> = {
      NETWORK_ERROR: 'Проблема с подключением к интернету',
      TIMEOUT_ERROR: 'Превышено время ожидания запроса',
      SERVER_ERROR: 'Ошибка сервера, попробуйте позже',
      SERVICE_UNAVAILABLE: 'Сервис временно недоступен',
      UNAUTHORIZED: 'Необходима авторизация',
      FORBIDDEN: 'Доступ запрещен',
      NOT_FOUND: 'Корзина не найдена',
      VALIDATION_ERROR: 'Ошибка валидации данных',
      CLIENT_ERROR: 'Ошибка в запросе',
      UNKNOWN_ERROR: 'Произошла неизвестная ошибка',
    };

    return errorMessages[error.code] || error.message;
  }

  /**
   * Получение конфигурации для повтора запроса
   */
  getRetryConfig(error: CartApiError): { shouldRetry: boolean; delay: number } {
    if (!this.isRetryableError(error)) {
      return { shouldRetry: false, delay: 0 };
    }

    // Экспоненциальная задержка
    const baseDelay = 1000; // 1 секунда
    const maxDelay = 30000; // 30 секунд
    const delay = Math.min(baseDelay * Math.pow(2, 0), maxDelay); // Пока без попыток

    return { shouldRetry: true, delay };
  }
}

// Создаем и экспортируем экземпляр сервиса
export const cartApiService = new CartApiService();

// Экспортируем класс для тестирования
export { CartApiService };
