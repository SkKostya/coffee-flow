// src/store/slices/paymentMethodsSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { paymentMethodsApi } from '../../payment-methods/api';
import type {
  CreatePaymentMethodRequest,
  PaymentMethodId,
  PaymentMethodsState,
  UpdatePaymentMethodRequest,
} from '../../types/payment-methods';

// Начальное состояние
const initialState: PaymentMethodsState = {
  methods: [],
  isLoading: false,
  error: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isSettingDefault: false,
};

// Async thunks
export const fetchPaymentMethods = createAsyncThunk(
  'paymentMethods/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const methods = await paymentMethodsApi.getPaymentMethods();
      return methods;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Ошибка загрузки методов оплаты',
        code: error.code || 'FETCH_PAYMENT_METHODS_ERROR',
      });
    }
  }
);

export const createPaymentMethod = createAsyncThunk(
  'paymentMethods/createPaymentMethod',
  async (data: CreatePaymentMethodRequest, { rejectWithValue }) => {
    try {
      const method = await paymentMethodsApi.createPaymentMethod(data);
      return method;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Ошибка создания метода оплаты',
        code: error.code || 'CREATE_PAYMENT_METHOD_ERROR',
      });
    }
  }
);

export const updatePaymentMethod = createAsyncThunk(
  'paymentMethods/updatePaymentMethod',
  async (
    { id, data }: { id: PaymentMethodId; data: UpdatePaymentMethodRequest },
    { rejectWithValue }
  ) => {
    try {
      const method = await paymentMethodsApi.updatePaymentMethod(id, data);
      return method;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Ошибка обновления метода оплаты',
        code: error.code || 'UPDATE_PAYMENT_METHOD_ERROR',
      });
    }
  }
);

export const deletePaymentMethod = createAsyncThunk(
  'paymentMethods/deletePaymentMethod',
  async (id: PaymentMethodId, { rejectWithValue }) => {
    try {
      await paymentMethodsApi.deletePaymentMethod(id);
      return id;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Ошибка удаления метода оплаты',
        code: error.code || 'DELETE_PAYMENT_METHOD_ERROR',
      });
    }
  }
);

export const setDefaultPaymentMethod = createAsyncThunk(
  'paymentMethods/setDefaultPaymentMethod',
  async (id: PaymentMethodId, { rejectWithValue }) => {
    try {
      const method = await paymentMethodsApi.setDefaultPaymentMethod(id);
      return method;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Ошибка установки метода оплаты по умолчанию',
        code: error.code || 'SET_DEFAULT_PAYMENT_METHOD_ERROR',
      });
    }
  }
);

// Слайс
const paymentMethodsSlice = createSlice({
  name: 'paymentMethods',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPaymentMethods: (state) => {
      state.methods = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch payment methods
    builder
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.methods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || 'Ошибка загрузки методов оплаты';
      });

    // Create payment method
    builder
      .addCase(createPaymentMethod.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createPaymentMethod.fulfilled, (state, action) => {
        state.isCreating = false;
        // Если новый метод по умолчанию, снимаем флаг с остальных
        if (action.payload.isDefault) {
          state.methods = state.methods.map((method) => ({
            ...method,
            isDefault: false,
          }));
        }
        state.methods.push(action.payload);
      })
      .addCase(createPaymentMethod.rejected, (state, action) => {
        state.isCreating = false;
        state.error =
          action.payload?.message || 'Ошибка создания метода оплаты';
      });

    // Update payment method
    builder
      .addCase(updatePaymentMethod.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedMethod = action.payload;
        const index = state.methods.findIndex(
          (method) => method.id === updatedMethod.id
        );

        if (index !== -1) {
          // Если обновленный метод по умолчанию, снимаем флаг с остальных
          if (updatedMethod.isDefault) {
            state.methods = state.methods.map((method) => ({
              ...method,
              isDefault: method.id === updatedMethod.id ? true : false,
            }));
          } else {
            state.methods[index] = updatedMethod;
          }
        }
      })
      .addCase(updatePaymentMethod.rejected, (state, action) => {
        state.isUpdating = false;
        state.error =
          action.payload?.message || 'Ошибка обновления метода оплаты';
      });

    // Delete payment method
    builder
      .addCase(deletePaymentMethod.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.methods = state.methods.filter(
          (method) => method.id !== action.payload
        );
      })
      .addCase(deletePaymentMethod.rejected, (state, action) => {
        state.isDeleting = false;
        state.error =
          action.payload?.message || 'Ошибка удаления метода оплаты';
      });

    // Set default payment method
    builder
      .addCase(setDefaultPaymentMethod.pending, (state) => {
        state.isSettingDefault = true;
        state.error = null;
      })
      .addCase(setDefaultPaymentMethod.fulfilled, (state, action) => {
        state.isSettingDefault = false;
        // Снимаем флаг isDefault со всех методов и устанавливаем для выбранного
        state.methods = state.methods.map((method) => ({
          ...method,
          isDefault: method.id === action.payload.id,
        }));
      })
      .addCase(setDefaultPaymentMethod.rejected, (state, action) => {
        state.isSettingDefault = false;
        state.error =
          action.payload?.message ||
          'Ошибка установки метода оплаты по умолчанию';
      });
  },
});

export const { clearError, clearPaymentMethods } = paymentMethodsSlice.actions;
export default paymentMethodsSlice.reducer;
