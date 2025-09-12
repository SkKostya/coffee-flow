// Redux slice для управления состоянием продуктов кофеен

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { productsApiService } from '../../coffee-shops/services/productsApi';
import type { ProductsParams, ProductsState } from '../../coffee-shops/types';

// Начальное состояние
const initialState: ProductsState = {
  items: [],
  isLoading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductsParams, { rejectWithValue }) => {
    try {
      const response = await productsApiService.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки продуктов'
      );
    }
  }
);

// Слайс
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Очистка ошибок
    clearError: (state) => {
      state.error = null;
    },

    // Установка фильтров
    setFilters: (state, action: PayloadAction<Partial<ProductsParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Очистка фильтров
    clearFilters: (state) => {
      state.filters = {};
    },

    // Очистка списка продуктов
    clearProducts: (state) => {
      state.items = [];
    },

    // Сброс состояния
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Экспорт действий
export const {
  clearError,
  setFilters,
  clearFilters,
  clearProducts,
  resetState,
} = productsSlice.actions;

// Экспорт редьюсера
export default productsSlice.reducer;
