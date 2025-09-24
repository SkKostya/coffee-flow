import { protectedApiClient } from '../../shared/api/ProtectedApiClient';
import type {
  AddOrderToFavoritesResponse,
  AddProductToFavoritesResponse,
  Favorite,
  GetFavoritesParams,
} from '../../types';

/**
 * API сервис для работы с избранным
 */
export class FavoritesApiService {
  private static readonly BASE_URL = '/favorites';

  /**
   * Получить все избранные элементы
   */
  static async getFavorites(params?: GetFavoritesParams): Promise<Favorite[]> {
    try {
      // Формируем URL с параметрами запроса
      let url = this.BASE_URL;
      if (params?.type) {
        url += `?type=${params.type}`;
      }

      const response = await protectedApiClient.get<Favorite[]>(url);
      return response.data || [];
    } catch (error) {
      console.error('Ошибка получения избранного:', error);
      throw new Error('Не удалось загрузить избранное');
    }
  }

  /**
   * Добавить продукт в избранное
   */
  static async addProductToFavorites(
    productId: string
  ): Promise<AddProductToFavoritesResponse> {
    try {
      const response =
        await protectedApiClient.post<AddProductToFavoritesResponse>(
          `${this.BASE_URL}/products/${productId}`
        );
      if (!response.data) {
        throw new Error('Пустой ответ от сервера');
      }
      return response.data;
    } catch (error) {
      console.error('Ошибка добавления продукта в избранное:', error);
      throw new Error('Не удалось добавить продукт в избранное');
    }
  }

  /**
   * Удалить продукт из избранного
   */
  static async removeProductFromFavorites(productId: string): Promise<void> {
    try {
      await protectedApiClient.delete(`${this.BASE_URL}/products/${productId}`);
    } catch (error) {
      console.error('Ошибка удаления продукта из избранного:', error);
      throw new Error('Не удалось удалить продукт из избранного');
    }
  }

  /**
   * Добавить заказ в избранное
   */
  static async addOrderToFavorites(
    orderId: string
  ): Promise<AddOrderToFavoritesResponse> {
    try {
      const response =
        await protectedApiClient.post<AddOrderToFavoritesResponse>(
          `${this.BASE_URL}/orders/${orderId}`
        );
      if (!response.data) {
        throw new Error('Пустой ответ от сервера');
      }
      return response.data;
    } catch (error) {
      console.error('Ошибка добавления заказа в избранное:', error);
      throw new Error('Не удалось добавить заказ в избранное');
    }
  }

  /**
   * Удалить заказ из избранного
   */
  static async removeOrderFromFavorites(orderId: string): Promise<void> {
    try {
      await protectedApiClient.delete(`${this.BASE_URL}/orders/${orderId}`);
    } catch (error) {
      console.error('Ошибка удаления заказа из избранного:', error);
      throw new Error('Не удалось удалить заказ из избранного');
    }
  }

  /**
   * Удалить элемент избранного по ID
   */
  static async removeFavorite(favoriteId: string): Promise<void> {
    try {
      await protectedApiClient.delete(`${this.BASE_URL}/${favoriteId}`);
    } catch (error) {
      console.error('Ошибка удаления избранного:', error);
      throw new Error('Не удалось удалить избранное');
    }
  }
}

export const favoritesApi = FavoritesApiService;
