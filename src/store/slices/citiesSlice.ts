import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { citiesApi } from '../../cities/services';
import type { CitiesState, City } from '../../cities/types';

// Типы для ошибок
interface CitiesError {
  message: string;
  code: string;
}

// Начальное состояние
const initialState: CitiesState = {
  cities: [],
  selectedCity: null,
  searchResults: [],
  isLoading: false,
  isSearching: false,
  error: null,
  searchQuery: '',
};

// Async thunks
export const fetchCities = createAsyncThunk<
  City[],
  void,
  { rejectValue: CitiesError }
>('cities/fetchCities', async (_, { rejectWithValue }) => {
  try {
    const cities = await citiesApi.getCities();
    return cities;
  } catch (error) {
    return rejectWithValue({
      message:
        error instanceof Error ? error.message : 'Ошибка загрузки городов',
      code: 'FETCH_CITIES_ERROR',
    });
  }
});

export const searchCities = createAsyncThunk<
  City[],
  string,
  { rejectValue: CitiesError }
>('cities/searchCities', async (query: string, { rejectWithValue }) => {
  try {
    if (!query.trim()) {
      return [];
    }

    const results = await citiesApi.searchCities({ q: query });
    return results;
  } catch (error) {
    return rejectWithValue({
      message: error instanceof Error ? error.message : 'Ошибка поиска городов',
      code: 'SEARCH_CITIES_ERROR',
    });
  }
});

// Слайс
const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    setCities: (state, action: PayloadAction<City[]>) => {
      state.cities = action.payload;
    },
    setSelectedCity: (state, action: PayloadAction<City | null>) => {
      state.selectedCity = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<City[]>) => {
      state.searchResults = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
      state.isSearching = false;
    },
    clearAll: (state) => {
      state.cities = [];
      state.selectedCity = null;
      state.searchResults = [];
      state.searchQuery = '';
      state.isLoading = false;
      state.isSearching = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchCities
    builder
      .addCase(fetchCities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities = action.payload;
        state.error = null;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Ошибка загрузки городов';
      });

    // searchCities
    builder
      .addCase(searchCities.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchCities.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload?.message || 'Ошибка поиска городов';
      });
  },
});

// Экспортируем действия
export const {
  setCities,
  setSelectedCity,
  setSearchResults,
  setSearchQuery,
  setLoading,
  setSearching,
  setError,
  clearError,
  clearSearch,
  clearAll,
} = citiesSlice.actions;

// Экспортируем редьюсер
export default citiesSlice.reducer;
