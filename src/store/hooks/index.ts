// src/store/hooks/index.ts
// Экспорт всех хуков store

export { useAppDispatch, useAppSelector } from '../hooks';

// Хуки корзины
export { useCart } from './useCart';
export { useCartErrorHandling } from './useCartErrorHandling';
export { useCartItem } from './useCartItem';
export { useCartOptimization } from './useCartOptimization';

// Хуки избранного
export {
  useFavoriteItem,
  useFavoriteOrders,
  useFavoriteProducts,
  useFavorites,
} from './useFavorites';

// Хуки заказов
export { useOrders } from './useOrders';

// Хуки повторных заказов
export { useRepeatOrder } from './useRepeatOrder';
