import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generalApi } from '../../general/services';
import type {
  Category,
  City,
  GeneralState,
  UserLocation,
} from '../../general/types';

// Типы для ошибок
interface GeneralError {
  message: string;
  code: string;
}

// Начальное состояние
const initialState: GeneralState = {
  categories: [],
  cities: [],
  user: {
    location: null,
    selectedCity: null,
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: GeneralError }
>('general/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const categories = await generalApi.getCategories();
    return categories;
  } catch (error) {
    return rejectWithValue({
      message:
        error instanceof Error ? error.message : 'Ошибка загрузки категорий',
      code: 'FETCH_CATEGORIES_ERROR',
    });
  }
});

export const fetchCategoryById = createAsyncThunk<
  Category,
  string,
  { rejectValue: GeneralError }
>('general/fetchCategoryById', async (id, { rejectWithValue }) => {
  try {
    const category = await generalApi.getCategoryById(id);
    return category;
  } catch (error) {
    return rejectWithValue({
      message:
        error instanceof Error ? error.message : 'Ошибка загрузки категории',
      code: 'FETCH_CATEGORY_ERROR',
    });
  }
});

export const fetchCities = createAsyncThunk<
  City[],
  void,
  { rejectValue: GeneralError }
>('general/fetchCities', async (_, { rejectWithValue }) => {
  try {
    const cities = await generalApi.getCities();
    return cities;
  } catch (error) {
    return rejectWithValue({
      message:
        error instanceof Error ? error.message : 'Ошибка загрузки городов',
      code: 'FETCH_CITIES_ERROR',
    });
  }
});

// Слайс
const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setCities: (state, action: PayloadAction<City[]>) => {
      state.cities = action.payload;
    },
    setSelectedCity: (state, action: PayloadAction<City | null>) => {
      state.user.selectedCity = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<UserLocation | null>) => {
      state.user.location = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Ошибка загрузки категорий';
      })
      // fetchCategoryById
      .addCase(fetchCategoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        // Обновляем категорию в списке или добавляем новую
        const existingIndex = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (existingIndex >= 0) {
          state.categories[existingIndex] = action.payload;
        } else {
          state.categories.push(action.payload);
        }
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Ошибка загрузки категории';
      })
      // fetchCities
      .addCase(fetchCities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Ошибка загрузки городов';
      });
  },
});

export const {
  setCategories,
  setCities,
  setSelectedCity,
  setUserLocation,
  setLoading,
  setError,
  clearError,
} = generalSlice.actions;
export default generalSlice.reducer;
