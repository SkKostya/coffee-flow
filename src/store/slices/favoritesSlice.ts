import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { favoritesApi } from '../../favorites/services';
import type { Favorite, FavoritesState, GetFavoritesParams } from '../../types';

// Начальное состояние
const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  error: null,
  lastFetchTime: null,
};

// Async thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (params?: GetFavoritesParams) => {
    const response = await favoritesApi.getFavorites(params);
    return response;
  }
);

export const addProductToFavorites = createAsyncThunk(
  'favorites/addProduct',
  async (productId: string) => {
    const response = await favoritesApi.addProductToFavorites(productId);
    return response;
  }
);

export const removeProductFromFavorites = createAsyncThunk(
  'favorites/removeProduct',
  async (productId: string) => {
    await favoritesApi.removeProductFromFavorites(productId);
    return productId;
  }
);

export const addOrderToFavorites = createAsyncThunk(
  'favorites/addOrder',
  async (orderId: string) => {
    const response = await favoritesApi.addOrderToFavorites(orderId);
    return response;
  }
);

export const removeOrderFromFavorites = createAsyncThunk(
  'favorites/removeOrder',
  async (orderId: string) => {
    await favoritesApi.removeOrderFromFavorites(orderId);
    return orderId;
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (favoriteId: string) => {
    await favoritesApi.removeFavorite(favoriteId);
    return favoriteId;
  }
);

// Слайс
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFavorites: (state) => {
      state.favorites = [];
      state.lastFetchTime = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Локальное добавление избранного (оптимистичное обновление)
    addFavoriteOptimistic: (state, action: PayloadAction<Favorite>) => {
      const existingIndex = state.favorites.findIndex(
        (fav) => fav.id === action.payload.id
      );
      if (existingIndex === -1) {
        state.favorites.push(action.payload);
      }
    },
    // Локальное удаление избранного (оптимистичное обновление)
    removeFavoriteOptimistic: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (fav) => fav.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // fetchFavorites
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки избранного';
      });

    // addProductToFavorites
    builder
      .addCase(addProductToFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(addProductToFavorites.fulfilled, (state, action) => {
        // Продукт уже добавлен через оптимистичное обновление
        // Обновляем ID если нужно
        const existingIndex = state.favorites.findIndex(
          (fav) => fav.productId === action.payload.productId
        );
        if (existingIndex !== -1) {
          state.favorites[existingIndex].id = action.payload.id;
          state.favorites[existingIndex].createdAt = action.payload.createdAt;
        }
      })
      .addCase(addProductToFavorites.rejected, (state, action) => {
        state.error =
          action.error.message || 'Ошибка добавления продукта в избранное';
        // Откатываем оптимистичное обновление
        state.favorites = state.favorites.filter(
          (fav) => fav.productId !== action.meta.arg
        );
      });

    // removeProductFromFavorites
    builder
      .addCase(removeProductFromFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(removeProductFromFavorites.fulfilled, (state, action) => {
        // Продукт уже удален через оптимистичное обновление
      })
      .addCase(removeProductFromFavorites.rejected, (state, action) => {
        state.error =
          action.error.message || 'Ошибка удаления продукта из избранного';
        // Восстанавливаем продукт в избранное
        // Здесь нужно будет восстановить данные продукта
      });

    // addOrderToFavorites
    builder
      .addCase(addOrderToFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(addOrderToFavorites.fulfilled, (state, action) => {
        // Заказ уже добавлен через оптимистичное обновление
        const existingIndex = state.favorites.findIndex(
          (fav) => fav.orderId === action.payload.orderId
        );
        if (existingIndex !== -1) {
          state.favorites[existingIndex].id = action.payload.id;
          state.favorites[existingIndex].createdAt = action.payload.createdAt;
        }
      })
      .addCase(addOrderToFavorites.rejected, (state, action) => {
        state.error =
          action.error.message || 'Ошибка добавления заказа в избранное';
        // Откатываем оптимистичное обновление
        state.favorites = state.favorites.filter(
          (fav) => fav.orderId !== action.meta.arg
        );
      });

    // removeOrderFromFavorites
    builder
      .addCase(removeOrderFromFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(removeOrderFromFavorites.fulfilled, (state, action) => {
        // Заказ уже удален через оптимистичное обновление
      })
      .addCase(removeOrderFromFavorites.rejected, (state, action) => {
        state.error =
          action.error.message || 'Ошибка удаления заказа из избранного';
        // Восстанавливаем заказ в избранное
      });

    // removeFavorite
    builder
      .addCase(removeFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        // Элемент уже удален через оптимистичное обновление
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка удаления избранного';
        // Восстанавливаем элемент в избранное
      });
  },
});

export const {
  clearError,
  clearFavorites,
  setLoading,
  addFavoriteOptimistic,
  removeFavoriteOptimistic,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
