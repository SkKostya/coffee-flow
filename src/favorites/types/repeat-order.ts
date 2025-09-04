export interface RepeatOrderItem {
  id: string;
  name: string;
  basePrice: number;
  image: string;
  size: string;
  quantity: number;
  customizations: OrderCustomization[];
  totalPrice: number;
}

export interface OrderCustomization {
  id: string;
  name: string;
  type: 'add' | 'remove';
  price: number; // 0 для бесплатных опций
  isSelected: boolean;
}

export interface RepeatOrder {
  id: string;
  items: RepeatOrderItem[];
  coffeeShopId: string;
  coffeeShopName: string;
  totalAmount: number;
  originalOrderId: string;
}

export interface RepeatOrderState {
  items: RepeatOrderItem[];
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

export interface RepeatOrderActions {
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleCustomization: (itemId: string, customizationId: string) => void;
  removeItem: (itemId: string) => void;
  calculateTotal: () => void;
  submitOrder: () => Promise<void>;
}
