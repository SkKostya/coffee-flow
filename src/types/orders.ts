// src/types/orders.ts

// Базовые типы заказа
export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  clientId: string;
  partnerId: string;
  createdAt: string;
  updatedAt: string;
  partner: Partner;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  product: Product;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category: string;
  basePrice: number;
}

export interface Partner {
  id: string;
  name: string;
  address: string;
  phone?: string;
  logo?: string;
  rating?: number;
}

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

// API запросы
export interface CreateOrderRequest {
  partnerId: string;
  items: CreateOrderItem[];
  notes?: string;
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface CreateOrderFromCartRequest {
  notes?: string;
  paymentMethodId: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

// API ответы
export interface CreateOrderResponse extends Order {}

export interface GetOrdersResponse extends Order {}

export interface UpdateOrderStatusResponse extends Order {}

export interface RepeatOrderResponse extends Order {}

// Состояние Redux
export interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
  lastFetchTime: number | null;
}

// Параметры для получения заказов
export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'totalAmount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Утилитарные типы
export type OrderWithPartner = Order & {
  partner: Partner;
};

export type OrderSummary = Pick<
  Order,
  'id' | 'orderNumber' | 'totalAmount' | 'status' | 'createdAt'
> & {
  partner: Pick<Partner, 'id' | 'name' | 'address'>;
  itemsCount: number;
};

// Типы для UI
export interface OrderCardData {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  partner: {
    name: string;
    address: string;
    logo?: string;
  };
  items: string[];
}

// Типы для статусов загрузки
export interface OrdersLoadingState {
  fetchOrders: boolean;
  createOrder: boolean;
  updateOrderStatus: boolean;
  repeatOrder: boolean;
  cancelOrder: boolean;
}

// Типы для ошибок
export interface OrdersError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: number;
}

// Типы для действий
export interface OrdersActions {
  fetchOrders: (params?: GetOrdersParams) => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<Order | null>;
  createOrderFromCart: (
    data: CreateOrderFromCartRequest
  ) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  repeatOrder: (orderId: string) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<void>;
  clearError: () => void;
  refreshOrders: () => Promise<void>;
}
