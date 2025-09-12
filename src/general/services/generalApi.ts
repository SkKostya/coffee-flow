import { apiClient } from '../../shared/api';
import { mapCategoryApiResponse } from '../helpers';
import type {
  Category,
  CategoryApiResponse,
  City,
  CityApiResponse,
} from '../types';
import { mapCityApiResponse } from '../types/general';

/**
 * API сервис для работы с общими данными
 */
export class GeneralApi {
  /**
   * Получить список всех категорий
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<CategoryApiResponse[]>('/categories');

    if (!response.success) {
      throw new Error(response.error || 'Ошибка загрузки категорий');
    }

    return response.data?.map(mapCategoryApiResponse) || [];
  }

  /**
   * Получить категорию по ID
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await apiClient.get<CategoryApiResponse>(
      `/categories/${id}`
    );

    if (!response.success) {
      throw new Error(response.error || 'Ошибка загрузки категории');
    }

    if (!response.data) {
      throw new Error('Категория не найдена');
    }

    return mapCategoryApiResponse(response.data);
  }

  /**
   * Получить список всех городов
   */
  async getCities(): Promise<City[]> {
    const response = await apiClient.get<CityApiResponse[]>('/cities');

    if (!response.success) {
      throw new Error(response.error || 'Ошибка загрузки городов');
    }

    return response.data?.map((apiCity) => mapCityApiResponse(apiCity)) || [];
  }
}

// Создаем экземпляр API сервиса
export const generalApi = new GeneralApi();

// Экспортируем класс для тестирования
export default GeneralApi;
