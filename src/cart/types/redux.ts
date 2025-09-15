// src/cart/types/redux.ts
// Redux типы для модуля корзины

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  AddCartItemRequest,
  Cart,
  CartError,
  CartItem,
  CartState,
  UpdateCartItemRequest,
} from '../../types/cart';

// ===== СЛАЙС ТИПЫ =====

export interface CartSliceState extends CartState {
  // Дополнительные состояния для Redux
  isInitialized: boolean;
  lastAction: CartAction | null;
  pendingActions: CartAction[];
  retryCount: number;
  maxRetries: number;
}

export interface CartAction {
  type: string;
  payload?: unknown;
  timestamp: number;
  retryable: boolean;
}

// ===== ASYNC THUNK ТИПЫ =====

export interface CartThunkConfig {
  rejectValue: CartError;
  state: { cart: CartSliceState };
}

// ===== REDUCER ТИПЫ =====

export interface CartReducers {
  // Синхронные действия
  setLoading: (state: CartSliceState, action: PayloadAction<boolean>) => void;
  setError: (
    state: CartSliceState,
    action: PayloadAction<string | null>
  ) => void;
  clearError: (state: CartSliceState) => void;
  setCart: (state: CartSliceState, action: PayloadAction<Cart | null>) => void;
  clearCart: (state: CartSliceState) => void;
  setLastUpdated: (
    state: CartSliceState,
    action: PayloadAction<string>
  ) => void;

  // Действия для оптимистичных обновлений
  addItemOptimistic: (
    state: CartSliceState,
    action: PayloadAction<CartItem>
  ) => void;
  updateItemOptimistic: (
    state: CartSliceState,
    action: PayloadAction<{ itemId: string; updates: Partial<CartItem> }>
  ) => void;
  removeItemOptimistic: (
    state: CartSliceState,
    action: PayloadAction<string>
  ) => void;

  // Действия для управления состоянием
  setInitialized: (
    state: CartSliceState,
    action: PayloadAction<boolean>
  ) => void;
  addPendingAction: (
    state: CartSliceState,
    action: PayloadAction<CartAction>
  ) => void;
  removePendingAction: (
    state: CartSliceState,
    action: PayloadAction<string>
  ) => void;
  setRetryCount: (state: CartSliceState, action: PayloadAction<number>) => void;
  incrementRetryCount: (state: CartSliceState) => void;
  resetRetryCount: (state: CartSliceState) => void;
}

// ===== ASYNC THUNK ТИПЫ =====

export interface CartAsyncThunks {
  // Загрузка корзины
  loadCart: {
    pending: (state: CartSliceState) => void;
    fulfilled: (state: CartSliceState, action: PayloadAction<Cart>) => void;
    rejected: (
      state: CartSliceState,
      action: PayloadAction<CartError | undefined>
    ) => void;
  };

  // Добавление товара
  addCartItem: {
    pending: (
      state: CartSliceState,
      action: PayloadAction<AddCartItemRequest>
    ) => void;
    fulfilled: (state: CartSliceState, action: PayloadAction<Cart>) => void;
    rejected: (
      state: CartSliceState,
      action: PayloadAction<CartError | undefined>
    ) => void;
  };

  // Обновление товара
  updateCartItem: {
    pending: (
      state: CartSliceState,
      action: PayloadAction<{ itemId: string; updates: UpdateCartItemRequest }>
    ) => void;
    fulfilled: (state: CartSliceState, action: PayloadAction<Cart>) => void;
    rejected: (
      state: CartSliceState,
      action: PayloadAction<CartError | undefined>
    ) => void;
  };

  // Удаление товара
  removeCartItem: {
    pending: (state: CartSliceState, action: PayloadAction<string>) => void;
    fulfilled: (state: CartSliceState, action: PayloadAction<Cart>) => void;
    rejected: (
      state: CartSliceState,
      action: PayloadAction<CartError | undefined>
    ) => void;
  };

  // Очистка корзины
  clearCart: {
    pending: (state: CartSliceState) => void;
    fulfilled: (state: CartSliceState) => void;
    rejected: (
      state: CartSliceState,
      action: PayloadAction<CartError | undefined>
    ) => void;
  };

  // Получение общей суммы
  getCartTotal: {
    pending: (state: CartSliceState) => void;
    fulfilled: (
      state: CartSliceState,
      action: PayloadAction<{ totalAmount: number; totalItems: number }>
    ) => void;
    rejected: (
      state: CartSliceState,
      action: PayloadAction<CartError | undefined>
    ) => void;
  };
}

// ===== СЕЛЕКТОР ТИПЫ =====

export interface CartSelectors {
  selectCart: (state: { cart: CartSliceState }) => Cart | null;
  selectCartItems: (state: { cart: CartSliceState }) => CartItem[];
  selectCartTotal: (state: { cart: CartSliceState }) => number;
  selectCartItemCount: (state: { cart: CartSliceState }) => number;
  selectCartLoading: (state: { cart: CartSliceState }) => boolean;
  selectCartError: (state: { cart: CartSliceState }) => string | null;
  selectCartIsEmpty: (state: { cart: CartSliceState }) => boolean;
  selectCartIsInitialized: (state: { cart: CartSliceState }) => boolean;
  selectCartLastUpdated: (state: { cart: CartSliceState }) => string | null;
  selectCartRetryCount: (state: { cart: CartSliceState }) => number;
  selectCartPendingActions: (state: { cart: CartSliceState }) => CartAction[];
}

// ===== ХУК ТИПЫ =====

export interface CartHookReturn {
  // Данные
  cart: Cart | null;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  partner: Cart['partner'] | null;

  // Состояния
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  isInitialized: boolean;
  lastUpdated: string | null;

  // Действия
  loadCart: () => Promise<void>;
  addItem: (item: AddCartItemRequest) => Promise<void>;
  updateItem: (itemId: string, updates: UpdateCartItemRequest) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  clearError: () => void;

  // Дополнительные действия
  retryLastAction: () => Promise<void>;
  canRetry: boolean;
  retryCount: number;
}

// ===== ТИПЫ ДЛЯ ОПТИМИЗАЦИИ =====

export interface CartOptimizationConfig {
  enableOptimisticUpdates: boolean;
  enableCaching: boolean;
  cacheTimeout: number;
  enableRetry: boolean;
  maxRetries: number;
  retryDelay: number;
}

export interface CartCacheEntry {
  data: Cart;
  timestamp: number;
  ttl: number;
}

// ===== ТИПЫ ДЛЯ МОНИТОРИНГА =====

export interface CartMetrics {
  loadTime: number;
  updateTime: number;
  errorRate: number;
  successRate: number;
  averageResponseTime: number;
  totalRequests: number;
  totalErrors: number;
}

export interface CartMonitoring {
  metrics: CartMetrics;
  trackAction: (action: string, duration: number, success: boolean) => void;
  getMetrics: () => CartMetrics;
  resetMetrics: () => void;
}
