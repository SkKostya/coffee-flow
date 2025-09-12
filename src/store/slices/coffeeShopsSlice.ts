// Redux slice для управления состоянием кофеен

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { coffeeShopsApiService } from '../../coffee-shops/services/coffeeShopsApi';
import type {
  CoffeeShop,
  CoffeeShopDetailsParams,
  CoffeeShopFilters,
  CoffeeShopState,
  NearbyCoffeeShopsParams,
} from '../../coffee-shops/types';

// Начальное состояние
const initialState: CoffeeShopState = {
  nearby: [],
  selected: null,
  isLoading: false,
  error: null,
  filters: {
    radius: 1, // 1 км по умолчанию
  },
  searchQuery: '',
};

// Async thunks
export const fetchNearbyCoffeeShops = createAsyncThunk(
  'coffeeShops/fetchNearby',
  async (params: NearbyCoffeeShopsParams, { rejectWithValue }) => {
    try {
      const response = await coffeeShopsApiService.getNearby(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки кофеен'
      );
    }
  }
);

export const fetchCoffeeShopById = createAsyncThunk(
  'coffeeShops/fetchById',
  async (params: CoffeeShopDetailsParams, { rejectWithValue }) => {
    try {
      const response = await coffeeShopsApiService.getById(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки кофейни'
      );
    }
  }
);

// Слайс
const coffeeShopsSlice = createSlice({
  name: 'coffeeShops',
  initialState,
  reducers: {
    // Очистка ошибок
    clearError: (state) => {
      state.error = null;
    },

    // Установка фильтров
    setFilters: (state, action: PayloadAction<Partial<CoffeeShopFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Установка поискового запроса
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    // Очистка поискового запроса
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },

    // Установка выбранной кофейни
    setSelectedCoffeeShop: (
      state,
      action: PayloadAction<CoffeeShop | null>
    ) => {
      state.selected = action.payload;
    },

    // Очистка выбранной кофейни
    clearSelectedCoffeeShop: (state) => {
      state.selected = null;
    },

    // Очистка списка кофеен рядом
    clearNearbyCoffeeShops: (state) => {
      state.nearby = [];
    },

    // Сброс состояния
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // fetchNearbyCoffeeShops
    builder
      .addCase(fetchNearbyCoffeeShops.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNearbyCoffeeShops.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nearby = action.payload;
        state.error = null;
      })
      .addCase(fetchNearbyCoffeeShops.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // fetchCoffeeShopById
    builder
      .addCase(fetchCoffeeShopById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoffeeShopById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selected = action.payload;
        state.error = null;
      })
      .addCase(fetchCoffeeShopById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Экспорт действий
export const {
  clearError,
  setFilters,
  setSearchQuery,
  clearSearchQuery,
  setSelectedCoffeeShop,
  clearSelectedCoffeeShop,
  clearNearbyCoffeeShops,
  resetState,
} = coffeeShopsSlice.actions;

// Экспорт редьюсера
export default coffeeShopsSlice.reducer;
