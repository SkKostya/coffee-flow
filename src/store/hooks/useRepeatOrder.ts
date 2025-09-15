// src/store/hooks/useRepeatOrder.ts
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import type {
  RepeatOrder,
  RepeatOrderItem,
} from '../../shared/types/repeat-order';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectOrders } from '../selectors/ordersSelectors';
import { createOrder } from '../slices/ordersSlice';
import { useFavoriteOrders } from './useFavorites';

interface UseRepeatOrderParams {
  orderId?: string;
  favoriteOrderId?: string;
}

export const useRepeatOrder = ({
  orderId,
  favoriteOrderId,
}: UseRepeatOrderParams) => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const { removeOrder: removeFavoriteOrder } = useFavoriteOrders();

  // Локальное состояние для управления товарами
  const [items, setItems] = useState<RepeatOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalOrder, setOriginalOrder] = useState<RepeatOrder | null>(null);

  // Загрузка данных заказа
  useEffect(() => {
    const loadOrderData = async () => {
      if (!orderId && !favoriteOrderId) return;

      setIsLoading(true);
      setError(null);

      try {
        let orderData: RepeatOrder | null = null;

        if (orderId) {
          // Загружаем из истории заказов
          const order = orders.find((o) => o.id === orderId);
          if (order) {
            orderData = convertOrderToRepeatOrder(order);
          }
        } else if (favoriteOrderId) {
          // Загружаем из избранного (пока используем моковые данные)
          // В реальном приложении здесь будет API запрос
          orderData = getMockFavoriteOrder(favoriteOrderId);
        }

        if (orderData) {
          setOriginalOrder(orderData);
          setItems(orderData.items);
        } else {
          setError('Заказ не найден');
        }
      } catch (err) {
        setError('Ошибка загрузки заказа');
        console.error('Error loading order:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderData();
  }, [orderId, favoriteOrderId, orders]);

  // Обновление количества товара
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  // Переключение кастомизации
  const toggleCustomization = useCallback(
    (itemId: string, customizationId: string) => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            const updatedCustomizations = item.customizations.map(
              (customization) =>
                customization.id === customizationId
                  ? { ...customization, isSelected: !customization.isSelected }
                  : customization
            );

            // Пересчитываем общую цену товара
            const basePrice = item.basePrice;
            const customizationPrice = updatedCustomizations
              .filter((c) => c.isSelected)
              .reduce((sum, c) => sum + c.price, 0);
            const totalPrice = basePrice + customizationPrice;

            return {
              ...item,
              customizations: updatedCustomizations,
              totalPrice,
            };
          }
          return item;
        })
      );
    },
    []
  );

  // Удаление товара
  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  // Расчет общей суммы
  const calculateTotalAmount = useCallback(() => {
    return items.reduce(
      (total, item) => total + item.totalPrice * item.quantity,
      0
    );
  }, [items]);

  // Подтверждение заказа
  const submitOrder = useCallback(async () => {
    if (!originalOrder || items.length === 0) {
      Alert.alert('Ошибка', 'Нет товаров для заказа');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Создаем заказ из повторного заказа
      const orderData = {
        partnerId: originalOrder.coffeeShopId,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          customizations: item.customizations
            .filter((c) => c.isSelected)
            .map((c) => ({
              id: c.id,
              name: c.name,
              type: c.type,
              price: c.price,
            })),
        })),
        totalAmount: calculateTotalAmount(),
        notes: `Повтор заказа ${originalOrder.originalOrderId}`,
      };

      const result = await dispatch(createOrder(orderData)).unwrap();

      // Если это был избранный заказ, удаляем его из избранного
      if (favoriteOrderId) {
        await removeFavoriteOrder(favoriteOrderId);
      }

      Alert.alert(
        'Заказ создан',
        'Ваш заказ успешно создан. Переходим к оплате.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/checkout'),
          },
        ]
      );
    } catch (err) {
      const errorMessage = 'Не удалось создать заказ. Попробуйте еще раз.';
      setError(errorMessage);
      Alert.alert('Ошибка', errorMessage);
      console.error('Error creating order:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    originalOrder,
    items,
    calculateTotalAmount,
    favoriteOrderId,
    dispatch,
    removeFavoriteOrder,
  ]);

  // Удаление из избранного
  const deleteFromFavorites = useCallback(async () => {
    if (!favoriteOrderId) return;

    try {
      await removeFavoriteOrder(favoriteOrderId);
      Alert.alert('Удалено', 'Заказ удален из избранного');
      router.back();
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось удалить заказ из избранного');
      console.error('Error removing from favorites:', err);
    }
  }, [favoriteOrderId, removeFavoriteOrder]);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Данные
    items,
    originalOrder,
    totalAmount: calculateTotalAmount(),

    // Состояния
    isLoading,
    error,

    // Действия
    updateQuantity,
    toggleCustomization,
    removeItem,
    submitOrder,
    deleteFromFavorites,
    clearError,
  };
};

// Вспомогательные функции
const convertOrderToRepeatOrder = (order: any): RepeatOrder => {
  // Здесь должна быть логика конвертации заказа в RepeatOrder
  // Пока возвращаем моковые данные
  return getMockRepeatOrder();
};

const getMockRepeatOrder = (): RepeatOrder => ({
  id: 'repeat-1-1234567890',
  items: [
    {
      id: '1',
      name: 'Капучино',
      basePrice: 990,
      image: 'https://example.com/cappuccino1.jpg',
      size: 'М - 400 мл',
      quantity: 2,
      customizations: [
        {
          id: 'caramel-syrup',
          name: 'Сироп Карамель',
          type: 'add',
          price: 100,
          isSelected: true,
        },
        {
          id: 'ice',
          name: 'Лёд',
          type: 'remove',
          price: 0,
          isSelected: false,
        },
      ],
      totalPrice: 1090,
    },
    {
      id: '2',
      name: 'Капучино',
      basePrice: 990,
      image: 'https://example.com/cappuccino2.jpg',
      size: 'М - 400 мл',
      quantity: 2,
      customizations: [],
      totalPrice: 990,
    },
  ],
  coffeeShopId: '1',
  coffeeShopName: 'Coffee BOOM',
  totalAmount: 4160,
  originalOrderId: '1',
});

const getMockFavoriteOrder = (favoriteOrderId: string): RepeatOrder => {
  return getMockRepeatOrder();
};
