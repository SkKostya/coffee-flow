// API сервис для работы с продуктами кофеен

import { apiClient } from '../../shared/api';
import type {
  CoffeeShopsApiError,
  ProductsParams,
  ProductsResponse,
} from '../types';

/**
 * API сервис для работы с продуктами кофеен
 */
export class ProductsApiService {
  private readonly baseEndpoint = '/partners';

  /**
   * Получение продуктов кофейни
   */
  async getProducts(params: ProductsParams): Promise<ProductsResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params.categoryId) {
        queryParams.append('categoryId', params.categoryId);
      }

      if (params.search) {
        queryParams.append('search', params.search);
      }

      const queryString = queryParams.toString();
      const endpoint = `${this.baseEndpoint}/${params.id}/products${
        queryString ? `?${queryString}` : ''
      }`;

      const response = await apiClient.get<ProductsResponse>(endpoint);

      return response.data;
    } catch (error) {
      console.error('ProductsApiService.getProducts error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Обработка ошибок API
   */
  private handleError(error: unknown): CoffeeShopsApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'API_ERROR',
      };
    }

    return {
      message: 'Произошла неизвестная ошибка',
      code: 'UNKNOWN_ERROR',
    };
  }
}

// Создаем экземпляр сервиса
export const productsApiService = new ProductsApiService();

// Экспортируем класс для тестирования
export default ProductsApiService;
