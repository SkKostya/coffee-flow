// src/store/slices/cartSlice.ts
// Redux slice для управления состоянием корзины

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cartApiService } from '../../cart/api/cartApi';
import type { CartAction, CartSliceState } from '../../cart/types/redux';
import type {
  AddCartItemRequest,
  Cart,
  CartError,
  GetCartTotalResponse,
  UpdateCartItemRequest,
} from '../../types/cart';

// ===== НАЧАЛЬНОЕ СОСТОЯНИЕ =====

const initialState: CartSliceState = {
  cart: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  isInitialized: false,
  lastAction: null,
  pendingActions: [],
  retryCount: 0,
  maxRetries: 3,
};

// ===== ASYNC THUNKS =====

/**
 * Загрузка корзины пользователя
 */
export const loadCart = createAsyncThunk<
  Cart,
  void,
  { rejectValue: CartError }
>('cart/loadCart', async (_, { rejectWithValue }) => {
  try {
    const cart = await cartApiService.getCart();
    return cart;
  } catch (error) {
    const cartError = error as CartError;
    return rejectWithValue(cartError);
  }
});

/**
 * Добавление товара в корзину
 */
export const addCartItem = createAsyncThunk<
  Cart,
  AddCartItemRequest,
  { rejectValue: CartError }
>('cart/addCartItem', async (itemData, { rejectWithValue }) => {
  try {
    const cart = await cartApiService.addCartItem(itemData);
    return cart;
  } catch (error) {
    const cartError = error as CartError;
    return rejectWithValue(cartError);
  }
});

/**
 * Обновление товара в корзине
 */
export const updateCartItem = createAsyncThunk<
  Cart,
  { itemId: string; updates: UpdateCartItemRequest },
  { rejectValue: CartError }
>('cart/updateCartItem', async ({ itemId, updates }, { rejectWithValue }) => {
  try {
    const cart = await cartApiService.updateCartItem({ itemId }, updates);
    return cart;
  } catch (error) {
    const cartError = error as CartError;
    return rejectWithValue(cartError);
  }
});

/**
 * Удаление товара из корзины
 */
export const removeCartItem = createAsyncThunk<
  Cart,
  string,
  { rejectValue: CartError }
>('cart/removeCartItem', async (itemId, { rejectWithValue }) => {
  try {
    const cart = await cartApiService.deleteCartItem({ itemId });
    return cart;
  } catch (error) {
    const cartError = error as CartError;
    return rejectWithValue(cartError);
  }
});

/**
 * Очистка корзины
 */
export const clearCart = createAsyncThunk<
  void,
  void,
  { rejectValue: CartError }
>('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await cartApiService.clearCart();
  } catch (error) {
    const cartError = error as CartError;
    return rejectWithValue(cartError);
  }
});

/**
 * Получение общей суммы корзины
 */
export const getCartTotal = createAsyncThunk<
  GetCartTotalResponse,
  void,
  { rejectValue: CartError }
>('cart/getCartTotal', async (_, { rejectWithValue }) => {
  try {
    const total = await cartApiService.getCartTotal();
    return total;
  } catch (error) {
    const cartError = error as CartError;
    return rejectWithValue(cartError);
  }
});

// ===== СЛАЙС =====

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Синхронные действия
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    setCart: (state, action: PayloadAction<Cart | null>) => {
      state.cart = action.payload;
      state.lastUpdated = action.payload ? new Date().toISOString() : null;
    },

    clearCartState: (state) => {
      state.cart = null;
      state.lastUpdated = null;
      state.error = null;
    },

    setLastUpdated: (state, action: PayloadAction<string>) => {
      state.lastUpdated = action.payload;
    },

    // Действия для оптимистичных обновлений
    addItemOptimistic: (state, action: PayloadAction<Cart['items'][0]>) => {
      if (state.cart) {
        state.cart.items.push(action.payload);
        state.cart.totalItems += action.payload.quantity;
        state.cart.totalAmount +=
          action.payload.totalPrice * action.payload.quantity;
      }
    },

    updateItemOptimistic: (
      state,
      action: PayloadAction<{
        itemId: string;
        updates: Partial<Cart['items'][0]>;
      }>
    ) => {
      if (state.cart) {
        const itemIndex = state.cart.items.findIndex(
          (item) => item.id === action.payload.itemId
        );
        if (itemIndex !== -1) {
          const item = state.cart.items[itemIndex];
          const updatedItem = { ...item, ...action.payload.updates };

          // Пересчитываем общую сумму
          const oldTotal = item.totalPrice * item.quantity;
          const newTotal = updatedItem.totalPrice * updatedItem.quantity;
          state.cart.totalAmount = state.cart.totalAmount - oldTotal + newTotal;

          // Пересчитываем общее количество
          state.cart.totalItems =
            state.cart.totalItems - item.quantity + updatedItem.quantity;

          state.cart.items[itemIndex] = updatedItem;
        }
      }
    },

    removeItemOptimistic: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        const itemIndex = state.cart.items.findIndex(
          (item) => item.id === action.payload
        );
        if (itemIndex !== -1) {
          const item = state.cart.items[itemIndex];
          state.cart.items.splice(itemIndex, 1);
          state.cart.totalItems -= item.quantity;
          state.cart.totalAmount -= item.totalPrice * item.quantity;
        }
      }
    },

    // Действия для управления состоянием
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },

    addPendingAction: (state, action: PayloadAction<CartAction>) => {
      state.pendingActions.push(action.payload);
    },

    removePendingAction: (state, action: PayloadAction<string>) => {
      state.pendingActions = state.pendingActions.filter(
        (action) => action.type !== action.payload
      );
    },

    setRetryCount: (state, action: PayloadAction<number>) => {
      state.retryCount = action.payload;
    },

    incrementRetryCount: (state) => {
      state.retryCount += 1;
    },

    resetRetryCount: (state) => {
      state.retryCount = 0;
    },

    // Действие для обновления корзины извне
    updateCartFromExternal: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ===== LOAD CART =====
    builder
      .addCase(loadCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.lastAction = {
          type: 'loadCart',
          timestamp: Date.now(),
          retryable: true,
        };
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
        state.isInitialized = true;
        state.retryCount = 0;
        state.lastAction = null;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Ошибка загрузки корзины';
        state.lastAction = {
          type: 'loadCart',
          timestamp: Date.now(),
          retryable: true,
        };
      });

    // ===== ADD CART ITEM =====
    builder
      .addCase(addCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.lastAction = {
          type: 'addCartItem',
          timestamp: Date.now(),
          retryable: true,
        };
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
        state.retryCount = 0;
        state.lastAction = null;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Ошибка добавления товара';
        state.lastAction = {
          type: 'addCartItem',
          timestamp: Date.now(),
          retryable: true,
        };
      });

    // ===== UPDATE CART ITEM =====
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.lastAction = {
          type: 'updateCartItem',
          timestamp: Date.now(),
          retryable: true,
        };
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
        state.retryCount = 0;
        state.lastAction = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Ошибка обновления товара';
        state.lastAction = {
          type: 'updateCartItem',
          timestamp: Date.now(),
          retryable: true,
        };
      });

    // ===== REMOVE CART ITEM =====
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.lastAction = {
          type: 'removeCartItem',
          timestamp: Date.now(),
          retryable: true,
        };
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
        state.retryCount = 0;
        state.lastAction = null;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Ошибка удаления товара';
        state.lastAction = {
          type: 'removeCartItem',
          timestamp: Date.now(),
          retryable: true,
        };
      });

    // ===== CLEAR CART =====
    builder
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.lastAction = {
          type: 'clearCart',
          timestamp: Date.now(),
          retryable: true,
        };
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cart = null;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
        state.retryCount = 0;
        state.lastAction = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Ошибка очистки корзины';
        state.lastAction = {
          type: 'clearCart',
          timestamp: Date.now(),
          retryable: true,
        };
      });

    // ===== GET CART TOTAL =====
    builder
      .addCase(getCartTotal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.lastAction = {
          type: 'getCartTotal',
          timestamp: Date.now(),
          retryable: true,
        };
      })
      .addCase(getCartTotal.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.cart) {
          state.cart.totalAmount = action.payload.totalAmount;
          state.cart.totalItems = action.payload.totalItems;
        }
        state.lastUpdated = new Date().toISOString();
        state.error = null;
        state.retryCount = 0;
        state.lastAction = null;
      })
      .addCase(getCartTotal.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || 'Ошибка получения суммы корзины';
        state.lastAction = {
          type: 'getCartTotal',
          timestamp: Date.now(),
          retryable: true,
        };
      });
  },
});

// ===== ЭКСПОРТ ДЕЙСТВИЙ =====

export const {
  setLoading,
  setError,
  clearError,
  setCart,
  clearCartState,
  setLastUpdated,
  addItemOptimistic,
  updateItemOptimistic,
  removeItemOptimistic,
  setInitialized,
  addPendingAction,
  removePendingAction,
  setRetryCount,
  incrementRetryCount,
  resetRetryCount,
  updateCartFromExternal,
} = cartSlice.actions;

// ===== ЭКСПОРТ REDUCER =====

export default cartSlice.reducer;
