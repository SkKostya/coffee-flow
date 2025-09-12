// API сервис для работы с городами

import { apiClient } from '../../shared/api';
import type { City, CityApiResponse } from '../types';
import { mapCityApiResponse } from '../types/cities';

/**
 * API сервис для работы с городами
 */
export class CitiesApiService {
  private readonly baseEndpoint = '/cities';

  /**
   * Получение списка всех городов
   */
  async getCities(): Promise<City[]> {
    try {
      const response = await apiClient.get<CityApiResponse[]>(
        this.baseEndpoint
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Ошибка получения городов');
      }

      // Преобразуем API ответ в наши типы
      return response.data.map((apiCity) => mapCityApiResponse(apiCity));
    } catch (error) {
      console.error('CitiesApiService.getCities error:', error);
      throw error;
    }
  }
}

// Создаем экземпляр сервиса
export const citiesApiService = new CitiesApiService();

// Экспортируем класс для тестирования
export default CitiesApiService;
