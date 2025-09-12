import { apiClient } from '../../shared/api';
import type { City, CityApiResponse, CitySearchParams } from '../types';
import { mapCityApiResponse } from '../types';

/**
 * API сервис для работы с городами
 */
export class CitiesApi {
  /**
   * Получить список всех городов
   */
  async getCities(): Promise<City[]> {
    const response = await apiClient.get<CityApiResponse[]>('/cities');

    if (!response.success) {
      throw new Error(response.error || 'Ошибка загрузки городов');
    }

    return response.data?.map(mapCityApiResponse) || [];
  }

  /**
   * Поиск городов по запросу
   */
  async searchCities(params: CitySearchParams): Promise<City[]> {
    const searchParams = new URLSearchParams({
      q: params.q,
    });

    const response = await apiClient.get<CityApiResponse[]>(
      `/cities/search?${searchParams.toString()}`
    );

    if (!response.success) {
      throw new Error(response.error || 'Ошибка поиска городов');
    }

    return response.data?.map(mapCityApiResponse) || [];
  }
}

// Создаем экземпляр API сервиса
export const citiesApi = new CitiesApi();

// Экспортируем класс для тестирования
export default CitiesApi;
