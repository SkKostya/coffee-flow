// src/store/hooks/index.ts
// Экспорт всех хуков store

export { useAppDispatch, useAppSelector } from '../hooks';

// Хуки корзины
export { useCart } from './useCart';
export { useCartErrorHandling } from './useCartErrorHandling';

// Хуки sticky корзины
export { useCartItem } from './useCartItem';
export { useCartOptimization } from './useCartOptimization';
export { useStickyCart } from './useStickyCart';

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
