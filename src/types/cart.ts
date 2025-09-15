// src/types/cart.ts
// Типы для корзины и API операций

// ===== БАЗОВЫЕ ТИПЫ КОРЗИНЫ =====

export interface CartItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  customizations: CartItemCustomizations;
  product: CartProduct;
}

export interface CartItemCustomizations {
  syrup?: string;
  ice?: boolean;
  milk?: string;
  size?: string;
  temperature?: string;
  [key: string]: string | boolean | undefined;
}

export interface CartProduct {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category: string;
  basePrice: number;
  isAvailable: boolean;
  coffeeShopId: string;
  coffeeShopName: string;
}

export interface CartPartner {
  id: string;
  name: string;
  address: string;
  logo?: string;
  isOpen: boolean;
  workingHours: {
    open: string;
    close: string;
  };
}

export interface Cart {
  id: string;
  totalAmount: number;
  totalItems: number;
  clientId: string;
  partnerId: string;
  createdAt: string;
  updatedAt: string;
  partner: CartPartner;
  items: CartItem[];
}

// ===== API ЗАПРОСЫ =====

// GET /cart
export interface GetCartResponse {
  id: string;
  totalAmount: number;
  totalItems: number;
  clientId: string;
  partnerId: string;
  createdAt: string;
  updatedAt: string;
  partner: CartPartner;
  items: CartItem[];
}

// POST /cart/items
export interface AddCartItemRequest {
  productId: string;
  quantity: number;
  notes?: string;
  customizations?: CartItemCustomizations;
}

export interface AddCartItemResponse {
  id: string;
  totalAmount: number;
  totalItems: number;
  clientId: string;
  partnerId: string;
  createdAt: string;
  updatedAt: string;
  partner: CartPartner;
  items: CartItem[];
}

// PUT /cart/items/{itemId}
export interface UpdateCartItemRequest {
  quantity?: number;
  notes?: string;
  customizations?: CartItemCustomizations;
}

export interface UpdateCartItemResponse {
  id: string;
  totalAmount: number;
  totalItems: number;
  clientId: string;
  partnerId: string;
  createdAt: string;
  updatedAt: string;
  partner: CartPartner;
  items: CartItem[];
}

// DELETE /cart/items/{itemId}
export interface DeleteCartItemResponse {
  id: string;
  totalAmount: number;
  totalItems: number;
  clientId: string;
  partnerId: string;
  createdAt: string;
  updatedAt: string;
  partner: CartPartner;
  items: CartItem[];
}

// GET /cart/total
export interface GetCartTotalResponse {
  totalAmount: number;
  totalItems: number;
}

// DELETE /cart
export interface ClearCartResponse {
  message: string;
}

// ===== REDUX СОСТОЯНИЯ =====

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// ===== ДЕЙСТВИЯ REDUX =====

export interface CartActions {
  // Синхронные действия
  clearError: () => void;
  setLoading: (loading: boolean) => void;

  // Асинхронные действия
  loadCart: () => Promise<void>;
  addItem: (item: AddCartItemRequest) => Promise<void>;
  updateItem: (itemId: string, updates: UpdateCartItemRequest) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => Promise<GetCartTotalResponse>;
}

// ===== ТИПЫ ДЛЯ КОМПОНЕНТОВ =====

export interface CartItemProps {
  item: CartItem;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onCustomizationToggle: (
    itemId: string,
    customizationKey: string,
    value: string | boolean
  ) => void;
  onRemove: (itemId: string) => void;
  onUpdateNotes: (itemId: string, notes: string) => void;
}

export interface CartSummaryProps {
  totalAmount: number;
  totalItems: number;
  isLoading: boolean;
  onCheckout: () => void;
}

// ===== ТИПЫ ДЛЯ ХУКОВ =====

export interface UseCartReturn {
  // Данные корзины
  cart: Cart | null;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  partner: CartPartner | null;

  // Состояния
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;

  // Действия
  loadCart: () => Promise<void>;
  addItem: (item: AddCartItemRequest) => Promise<void>;
  updateItem: (itemId: string, updates: UpdateCartItemRequest) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  clearError: () => void;
}

export interface UseCartItemReturn {
  item: CartItem;
  isLoading: boolean;
  error: string | null;

  updateQuantity: (quantity: number) => Promise<void>;
  updateCustomizations: (
    customizations: CartItemCustomizations
  ) => Promise<void>;
  updateNotes: (notes: string) => Promise<void>;
  remove: () => Promise<void>;
}

// ===== ТИПЫ ДЛЯ ВАЛИДАЦИИ =====

export interface CartValidationErrors {
  quantity?: string;
  customizations?: Record<string, string>;
  notes?: string;
  productId?: string;
}

export interface CartItemValidation {
  isValid: boolean;
  errors: CartValidationErrors;
}

// ===== ТИПЫ ДЛЯ ОПТИМИЗАЦИИ =====

export interface CartOptimisticUpdate {
  type: 'add' | 'update' | 'remove' | 'clear';
  itemId?: string;
  data?: Partial<CartItem>;
  timestamp: number;
}

export interface CartCache {
  cart: Cart | null;
  lastFetched: number;
  ttl: number; // Time to live in milliseconds
}

// ===== ТИПЫ ДЛЯ ОБРАБОТКИ ОШИБОК =====

export interface CartError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  retryable: boolean;
  timestamp: number;
}

export interface CartErrorDisplay {
  title: string;
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

// ===== УТИЛИТАРНЫЕ ТИПЫ =====

export type CartOperation =
  | 'load'
  | 'add'
  | 'update'
  | 'remove'
  | 'clear'
  | 'total';

export type CartLoadingState = {
  [K in CartOperation]: boolean;
};

export interface CartMetrics {
  totalValue: number;
  averageItemPrice: number;
  mostExpensiveItem: CartItem | null;
  cheapestItem: CartItem | null;
  itemCount: number;
  categoryBreakdown: Record<string, number>;
}

// ===== ТИПЫ ДЛЯ ИНТЕГРАЦИИ =====

export interface CartIntegrationConfig {
  autoSync: boolean;
  syncInterval: number; // milliseconds
  retryAttempts: number;
  retryDelay: number; // milliseconds
  optimisticUpdates: boolean;
}

export interface CartSyncStatus {
  isSyncing: boolean;
  lastSync: string | null;
  pendingChanges: number;
  syncErrors: CartError[];
}
