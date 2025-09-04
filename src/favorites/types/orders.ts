export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  coffeeShopId: string;
  coffeeShopName: string;
  coffeeShopAddress: string;
  paymentMethod?: string;
  deliveryAddress?: string;
  notes?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface OrderHistory {
  orders: Order[];
  totalOrders: number;
  totalSpent: number;
  favoriteItems: OrderItem[];
}

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  coffeeShopId?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface RepeatOrderData {
  orderId: string;
  items: OrderItem[];
  coffeeShopId: string;
  coffeeShopName: string;
}
