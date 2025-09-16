import { useCallback, useEffect } from 'react';
import type { Favorite, FavoriteType, GetFavoritesParams } from '../../types';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectFavorites,
  selectFavoritesError,
  selectFavoritesInfo,
  selectFavoritesLastFetchTime,
  selectFavoritesLoading,
  selectFavoritesStats,
  selectIsOrderFavorite,
  selectIsProductFavorite,
} from '../selectors/favoritesSelectors';
import {
  addFavoriteOptimistic,
  addOrderToFavorites,
  addProductToFavorites,
  clearError,
  clearFavorites,
  fetchFavorites,
  removeFavoriteOptimistic,
  removeOrderFromFavorites,
  removeProductFromFavorites,
} from '../slices/favoritesSlice';

/**
 * Основной хук для работы с избранным
 */
export const useFavorites = () => {
  const dispatch = useAppDispatch();

  const favorites = useAppSelector(selectFavorites);
  const isLoading = useAppSelector(selectFavoritesLoading);
  const error = useAppSelector(selectFavoritesError);
  const lastFetchTime = useAppSelector(selectFavoritesLastFetchTime);
  const info = useAppSelector(selectFavoritesInfo);
  const stats = useAppSelector(selectFavoritesStats);

  // Загрузка избранного
  const loadFavorites = useCallback(
    (params?: GetFavoritesParams) => {
      dispatch(fetchFavorites(params));
    },
    [dispatch]
  );

  // Очистка ошибки
  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Очистка всех избранных
  const clearAllFavorites = useCallback(() => {
    dispatch(clearFavorites());
  }, [dispatch]);

  // Автоматическая загрузка при монтировании (без retry)
  useEffect(() => {
    if (favorites.length === 0 && !isLoading && !error) {
      loadFavorites();
    }
  }, []); // Пустой массив зависимостей - выполняется только при монтировании

  return {
    favorites,
    isLoading,
    error,
    lastFetchTime,
    info,
    stats,
    loadFavorites,
    clearError: clearErrorState,
    clearAllFavorites,
  };
};

/**
 * Хук для работы с избранными продуктами
 */
export const useFavoriteProducts = () => {
  const dispatch = useAppDispatch();

  const favorites = useAppSelector(selectFavorites);
  const isLoading = useAppSelector(selectFavoritesLoading);
  const error = useAppSelector(selectFavoritesError);

  const favoriteProducts = favorites.filter((fav) => fav.type === 'product');

  // Добавить продукт в избранное
  const addProduct = useCallback(
    async (productId: string) => {
      try {
        // Оптимистичное обновление
        const optimisticFavorite: Favorite = {
          id: `temp-${productId}`,
          type: 'product',
          clientId: '', // Будет заполнено после ответа сервера
          productId,
          createdAt: new Date().toISOString(),
        };
        dispatch(addFavoriteOptimistic(optimisticFavorite));

        await dispatch(addProductToFavorites(productId)).unwrap();
      } catch (err) {
        console.error('Ошибка добавления продукта в избранное:', err);
        throw err;
      }
    },
    [dispatch]
  );

  // Удалить продукт из избранного
  const removeProduct = useCallback(
    async (productId: string) => {
      try {
        // Оптимистичное обновление
        const favoriteToRemove = favorites.find(
          (fav) => fav.productId === productId
        );
        if (favoriteToRemove) {
          dispatch(removeFavoriteOptimistic(favoriteToRemove.id));
        }

        await dispatch(removeProductFromFavorites(productId)).unwrap();
      } catch (err) {
        console.error('Ошибка удаления продукта из избранного:', err);
        throw err;
      }
    },
    [dispatch, favorites]
  );

  // Переключить статус избранного для продукта
  const toggleProduct = useCallback(
    async (productId: string) => {
      const isFavorite = favorites.some((fav) => fav.productId === productId);

      if (isFavorite) {
        await removeProduct(productId);
      } else {
        await addProduct(productId);
      }
    },
    [favorites, addProduct, removeProduct]
  );

  // Проверить, является ли продукт избранным
  const isProductFavorite = useCallback(
    (productId: string) => {
      return favorites.some((fav) => fav.productId === productId);
    },
    [favorites]
  );

  return {
    favoriteProducts,
    isLoading,
    error,
    addProduct,
    removeProduct,
    toggleProduct,
    isProductFavorite,
  };
};

/**
 * Хук для работы с избранными заказами
 */
export const useFavoriteOrders = () => {
  const dispatch = useAppDispatch();

  const favorites = useAppSelector(selectFavorites);
  const isLoading = useAppSelector(selectFavoritesLoading);
  const error = useAppSelector(selectFavoritesError);

  const favoriteOrders = favorites.filter((fav) => fav.type === 'order');

  // Добавить заказ в избранное
  const addOrder = useCallback(
    async (orderId: string) => {
      try {
        // Оптимистичное обновление
        const optimisticFavorite: Favorite = {
          id: `temp-${orderId}`,
          type: 'order',
          clientId: '', // Будет заполнено после ответа сервера
          orderId,
          createdAt: new Date().toISOString(),
        };
        dispatch(addFavoriteOptimistic(optimisticFavorite));

        await dispatch(addOrderToFavorites(orderId)).unwrap();
      } catch (err) {
        console.error('Ошибка добавления заказа в избранное:', err);
        throw err;
      }
    },
    [dispatch]
  );

  // Удалить заказ из избранного
  const removeOrder = useCallback(
    async (orderId: string) => {
      try {
        // Оптимистичное обновление
        const favoriteToRemove = favorites.find(
          (fav) => fav.orderId === orderId
        );
        if (favoriteToRemove) {
          dispatch(removeFavoriteOptimistic(favoriteToRemove.id));
        }

        await dispatch(removeOrderFromFavorites(orderId)).unwrap();
      } catch (err) {
        console.error('Ошибка удаления заказа из избранного:', err);
        throw err;
      }
    },
    [dispatch, favorites]
  );

  // Переключить статус избранного для заказа
  const toggleOrder = useCallback(
    async (orderId: string) => {
      const isFavorite = favorites.some((fav) => fav.orderId === orderId);

      if (isFavorite) {
        await removeOrder(orderId);
      } else {
        await addOrder(orderId);
      }
    },
    [favorites, addOrder, removeOrder]
  );

  // Проверить, является ли заказ избранным
  const isOrderFavorite = useCallback(
    (orderId: string) => {
      return favorites.some((fav) => fav.orderId === orderId);
    },
    [favorites]
  );

  return {
    favoriteOrders,
    isLoading,
    error,
    addOrder,
    removeOrder,
    toggleOrder,
    isOrderFavorite,
  };
};

/**
 * Хук для работы с конкретным элементом избранного
 */
export const useFavoriteItem = (itemId: string, type: FavoriteType) => {
  const dispatch = useAppDispatch();

  const isProductFavorite = useAppSelector((state) =>
    selectIsProductFavorite(state, itemId)
  );
  const isOrderFavorite = useAppSelector((state) =>
    selectIsOrderFavorite(state, itemId)
  );
  const isLoading = useAppSelector(selectFavoritesLoading);
  const error = useAppSelector(selectFavoritesError);

  const isFavorite = type === 'product' ? isProductFavorite : isOrderFavorite;

  // Переключить статус избранного
  const toggle = useCallback(async () => {
    try {
      if (type === 'product') {
        if (isFavorite) {
          await dispatch(removeProductFromFavorites(itemId)).unwrap();
        } else {
          await dispatch(addProductToFavorites(itemId)).unwrap();
        }
      } else {
        if (isFavorite) {
          await dispatch(removeOrderFromFavorites(itemId)).unwrap();
        } else {
          await dispatch(addOrderToFavorites(itemId)).unwrap();
        }
      }
    } catch (err) {
      console.error('Ошибка переключения избранного:', err);
      throw err;
    }
  }, [dispatch, itemId, type, isFavorite]);

  return {
    isFavorite,
    isLoading,
    error,
    toggle,
  };
};
