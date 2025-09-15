// src/cart/types/api.ts
// API типы для модуля корзины

import type {
  AddCartItemRequest,
  AddCartItemResponse,
  Cart,
  ClearCartResponse,
  DeleteCartItemResponse,
  GetCartResponse,
  GetCartTotalResponse,
  UpdateCartItemRequest,
  UpdateCartItemResponse,
} from '../../types/cart';

// ===== БАЗОВЫЕ API ТИПЫ =====

export interface CartApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface CartApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

// ===== ТИПЫ ENDPOINTS =====

// GET /cart
export type GetCartApiResponse = CartApiResponse<GetCartResponse>;

// POST /cart/items
export type AddCartItemApiResponse = CartApiResponse<AddCartItemResponse>;

// PUT /cart/items/{itemId}
export interface UpdateCartItemParams {
  itemId: string;
}

export type UpdateCartItemApiResponse = CartApiResponse<UpdateCartItemResponse>;

// DELETE /cart/items/{itemId}
export interface DeleteCartItemParams {
  itemId: string;
}

export type DeleteCartItemApiResponse = CartApiResponse<DeleteCartItemResponse>;

// GET /cart/total
export type GetCartTotalApiResponse = CartApiResponse<GetCartTotalResponse>;

// DELETE /cart
export type ClearCartApiResponse = CartApiResponse<ClearCartResponse>;

// ===== ТИПЫ ДЛЯ API КЛИЕНТА =====

export interface CartApiClient {
  getCart: () => Promise<GetCartResponse>;
  addCartItem: (data: AddCartItemRequest) => Promise<AddCartItemResponse>;
  updateCartItem: (
    params: UpdateCartItemParams,
    data: UpdateCartItemRequest
  ) => Promise<UpdateCartItemResponse>;
  deleteCartItem: (
    params: DeleteCartItemParams
  ) => Promise<DeleteCartItemResponse>;
  getCartTotal: () => Promise<GetCartTotalResponse>;
  clearCart: () => Promise<ClearCartResponse>;
}

// ===== ТИПЫ ДЛЯ ОБРАБОТКИ ОШИБОК =====

export interface CartApiErrorHandler {
  handleError: (error: CartApiError) => void;
  getErrorMessage: (error: CartApiError) => string;
  isRetryableError: (error: CartApiError) => boolean;
}

// ===== ТИПЫ ДЛЯ КЭШИРОВАНИЯ =====

export interface CartApiCache {
  get: (key: string) => Cart | null;
  set: (key: string, data: Cart, ttl?: number) => void;
  clear: (key?: string) => void;
  isExpired: (key: string) => boolean;
}

// ===== ТИПЫ ДЛЯ СИНХРОНИЗАЦИИ =====

export interface CartSyncConfig {
  enabled: boolean;
  interval: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface CartSyncStatus {
  isActive: boolean;
  lastSync: Date | null;
  nextSync: Date | null;
  errorCount: number;
  lastError: CartApiError | null;
}

// ===== ТИПЫ ДЛЯ ВАЛИДАЦИИ =====

export interface CartApiValidation {
  validateAddItem: (data: AddCartItemRequest) => boolean;
  validateUpdateItem: (data: UpdateCartItemRequest) => boolean;
  validateItemId: (itemId: string) => boolean;
}

// ===== ТИПЫ ДЛЯ МОНИТОРИНГА =====

export interface CartApiMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastRequestTime: Date | null;
}

export interface CartApiMonitor {
  metrics: CartApiMetrics;
  logRequest: (endpoint: string, duration: number, success: boolean) => void;
  getMetrics: () => CartApiMetrics;
  resetMetrics: () => void;
}
