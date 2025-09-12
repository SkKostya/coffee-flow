// API сервис для работы с кофейнями

import { apiClient } from '../../shared/api';
import type {
  CoffeeShopDetailsParams,
  CoffeeShopDetailsResponse,
  CoffeeShopsApiError,
  NearbyCoffeeShopsParams,
  NearbyCoffeeShopsResponse,
} from '../types';

/**
 * API сервис для работы с кофейнями
 */
export class CoffeeShopsApiService {
  private readonly baseEndpoint = '/partners';

  /**
   * Получение кофеен рядом с указанными координатами
   */
  async getNearby(
    params: NearbyCoffeeShopsParams
  ): Promise<NearbyCoffeeShopsResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('latitude', params.latitude.toString());
      queryParams.append('longitude', params.longitude.toString());

      if (params.radius) {
        queryParams.append('radius', params.radius.toString());
      }

      if (params.cityId) {
        queryParams.append('cityId', params.cityId);
      }

      const url = `${this.baseEndpoint}/nearby?${queryParams.toString()}`;
      console.log('CoffeeShopsApiService.getNearby - Request URL:', url);
      console.log('CoffeeShopsApiService.getNearby - Params:', params);

      const response = await apiClient.get<NearbyCoffeeShopsResponse>(url);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Ошибка получения кофеен');
      }

      return response.data;
    } catch (error) {
      console.error('CoffeeShopsApiService.getNearby error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Получение детальной информации о кофейне
   */
  async getById(
    params: CoffeeShopDetailsParams
  ): Promise<CoffeeShopDetailsResponse> {
    try {
      const response = await apiClient.get<CoffeeShopDetailsResponse>(
        `${this.baseEndpoint}/${params.id}`
      );

      if (!response.success || !response.data) {
        throw new Error(
          response.error || 'Ошибка получения информации о кофейне'
        );
      }

      return response.data;
    } catch (error) {
      console.error('CoffeeShopsApiService.getById error:', error);
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
export const coffeeShopsApiService = new CoffeeShopsApiService();

// Экспортируем класс для тестирования
export default CoffeeShopsApiService;
