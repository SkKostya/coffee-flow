// src/cart/utils/cartUtils.ts
// Утилиты для работы с корзиной

import type {
  Cart,
  CartItem,
  CartItemCustomizations,
  CartMetrics,
  CartValidationErrors,
} from '../../types/cart';

// ===== ВАЛИДАЦИЯ =====

/**
 * Валидация данных товара корзины
 */
export const validateCartItem = (
  item: Partial<CartItem>
): CartValidationErrors => {
  const errors: CartValidationErrors = {};

  if (!item.product?.id) {
    errors.productId = 'ID продукта обязателен';
  }

  if (item.quantity !== undefined) {
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      errors.quantity = 'Количество должно быть положительным числом';
    } else if (item.quantity > 99) {
      errors.quantity = 'Количество не может превышать 99';
    }
  }

  if (item.notes && item.notes.length > 500) {
    errors.notes = 'Примечания не могут превышать 500 символов';
  }

  if (item.customizations) {
    const customizationErrors = validateCustomizations(item.customizations);
    if (Object.keys(customizationErrors).length > 0) {
      errors.customizations = customizationErrors;
    }
  }

  return errors;
};

/**
 * Валидация кастомизаций
 */
export const validateCustomizations = (
  customizations: CartItemCustomizations
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const maxCustomizations = 10;
  const customizationsCount = Object.keys(customizations).length;

  if (customizationsCount > maxCustomizations) {
    errors.general = `Нельзя иметь более ${maxCustomizations} кастомизаций`;
    return errors;
  }

  for (const [key, value] of Object.entries(customizations)) {
    if (typeof key !== 'string' || key.length === 0) {
      errors[key] = 'Ключи кастомизации должны быть непустыми строками';
      continue;
    }

    if (typeof value !== 'string' && typeof value !== 'boolean') {
      errors[key] =
        'Значения кастомизации должны быть строками или булевыми значениями';
      continue;
    }

    if (typeof value === 'string' && value.length > 100) {
      errors[key] =
        'Строковые значения кастомизации не могут превышать 100 символов';
    }
  }

  return errors;
};

/**
 * Проверка валидности корзины
 */
export const isCartValid = (cart: Cart | null): boolean => {
  if (!cart) return false;

  // Проверяем основные поля
  if (!cart.id || !cart.clientId || !cart.partnerId) return false;
  if (typeof cart.totalAmount !== 'number' || cart.totalAmount < 0)
    return false;
  if (typeof cart.totalItems !== 'number' || cart.totalItems < 0) return false;

  // Проверяем товары
  if (!Array.isArray(cart.items)) return false;

  for (const item of cart.items) {
    const itemErrors = validateCartItem(item);
    if (Object.keys(itemErrors).length > 0) return false;
  }

  return true;
};

// ===== ВЫЧИСЛЕНИЯ =====

/**
 * Вычисление общей суммы корзины
 */
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce(
    (total, item) => total + item.totalPrice * item.quantity,
    0
  );
};

/**
 * Вычисление общего количества товаров
 */
export const calculateCartItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

/**
 * Вычисление метрик корзины
 */
export const calculateCartMetrics = (cart: Cart | null): CartMetrics => {
  if (!cart || !cart.items.length) {
    return {
      totalValue: 0,
      averageItemPrice: 0,
      mostExpensiveItem: null,
      cheapestItem: null,
      itemCount: 0,
      categoryBreakdown: {},
    };
  }

  const items = cart.items;
  const totalValue = calculateCartTotal(items);
  const itemCount = calculateCartItemCount(items);
  const averageItemPrice = itemCount > 0 ? totalValue / itemCount : 0;

  // Находим самый дорогой и самый дешевый товар
  const sortedByPrice = [...items].sort((a, b) => b.unitPrice - a.unitPrice);
  const mostExpensiveItem = sortedByPrice[0] || null;
  const cheapestItem = sortedByPrice[sortedByPrice.length - 1] || null;

  // Группировка по категориям
  const categoryBreakdown = items.reduce((acc, item) => {
    const category = item.product.category;
    acc[category] = (acc[category] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalValue,
    averageItemPrice,
    mostExpensiveItem,
    cheapestItem,
    itemCount,
    categoryBreakdown,
  };
};

// ===== ФОРМАТИРОВАНИЕ =====

/**
 * Форматирование цены
 */
export const formatPrice = (price: number, currency: string = '〒'): string => {
  return `${price.toLocaleString('ru-RU')} ${currency}`;
};

/**
 * Форматирование количества
 */
export const formatQuantity = (quantity: number): string => {
  if (quantity === 1) return '1 шт';
  if (quantity < 5) return `${quantity} шт`;
  return `${quantity} шт`;
};

/**
 * Форматирование кастомизаций для отображения
 */
export const formatCustomizations = (
  customizations: CartItemCustomizations
): string[] => {
  return Object.entries(customizations)
    .filter(([_, value]) => value !== false && value !== '')
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : `Без ${key}`;
      }
      return `${key}: ${value}`;
    });
};

// ===== ПОИСК И ФИЛЬТРАЦИЯ =====

/**
 * Поиск товара в корзине по ID
 */
export const findCartItem = (
  cart: Cart | null,
  itemId: string
): CartItem | null => {
  if (!cart || !cart.items) return null;
  return cart.items.find((item) => item.id === itemId) || null;
};

/**
 * Поиск товаров по категории
 */
export const findItemsByCategory = (
  cart: Cart | null,
  category: string
): CartItem[] => {
  if (!cart || !cart.items) return [];
  return cart.items.filter((item) => item.product.category === category);
};

/**
 * Поиск товаров по кофейне
 */
export const findItemsByCoffeeShop = (
  cart: Cart | null,
  coffeeShopId: string
): CartItem[] => {
  if (!cart || !cart.items) return [];
  return cart.items.filter(
    (item) => item.product.coffeeShopId === coffeeShopId
  );
};

// ===== ОПТИМИЗАЦИЯ =====

/**
 * Проверка, нужно ли обновлять корзину
 */
export const shouldUpdateCart = (
  currentCart: Cart | null,
  newCart: Cart | null,
  lastUpdated: string | null
): boolean => {
  if (!currentCart && !newCart) return false;
  if (!currentCart && newCart) return true;
  if (currentCart && !newCart) return true;

  if (!newCart) return false;

  // Проверяем по времени обновления
  if (lastUpdated && newCart.updatedAt <= lastUpdated) return false;

  // Проверяем по ID корзины
  if (currentCart!.id !== newCart.id) return true;

  // Проверяем по количеству товаров
  if (currentCart!.totalItems !== newCart.totalItems) return true;

  // Проверяем по общей сумме
  if (currentCart!.totalAmount !== newCart.totalAmount) return true;

  return false;
};

/**
 * Мемоизация вычислений корзины
 */
export const memoizeCartCalculations = () => {
  let cache: {
    cart: Cart | null;
    metrics: CartMetrics;
    lastCalculated: number;
  } = {
    cart: null,
    metrics: {
      totalValue: 0,
      averageItemPrice: 0,
      mostExpensiveItem: null,
      cheapestItem: null,
      itemCount: 0,
      categoryBreakdown: {},
    },
    lastCalculated: 0,
  };

  return (cart: Cart | null): CartMetrics => {
    const now = Date.now();
    const CACHE_TTL = 5000; // 5 секунд

    if (cache.cart === cart && now - cache.lastCalculated < CACHE_TTL) {
      return cache.metrics;
    }

    cache.cart = cart;
    cache.metrics = calculateCartMetrics(cart);
    cache.lastCalculated = now;

    return cache.metrics;
  };
};

// ===== КОНСТАНТЫ =====

export const CART_CONSTANTS = {
  MAX_QUANTITY: 99,
  MAX_NOTES_LENGTH: 500,
  MAX_CUSTOMIZATIONS: 10,
  MAX_CUSTOMIZATION_VALUE_LENGTH: 100,
  CACHE_TTL: 5000, // 5 секунд
  RETRY_DELAY: 1000, // 1 секунда
  MAX_RETRIES: 3,
} as const;

// ===== ТИПЫ ДЛЯ УТИЛИТ =====

export interface CartCalculationCache {
  cart: Cart | null;
  metrics: CartMetrics;
  lastCalculated: number;
}

export interface CartUpdateCheck {
  shouldUpdate: boolean;
  reason?: string;
}
