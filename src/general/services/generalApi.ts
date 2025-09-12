import { apiClient } from '../../shared/api';
import type {
  Category,
  CategoryApiResponse,
  mapCategoryApiResponse,
} from '../types';

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
}

// Создаем экземпляр API сервиса
export const generalApi = new GeneralApi();

// Экспортируем класс для тестирования
export default GeneralApi;
