import { useCallback, useState } from 'react';
import type {
  Order,
  OrderCustomization,
  RepeatOrder,
  RepeatOrderItem,
} from '../types';

interface UseRepeatOrderParams {
  originalOrder: Order;
  onSuccess?: (order: RepeatOrder) => void;
  onError?: (error: string) => void;
}

interface UseRepeatOrderReturn {
  repeatOrder: RepeatOrder | null;
  isLoading: boolean;
  error: string | null;
  createRepeatOrder: (order: Order) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  toggleCustomization: (itemId: string, customizationId: string) => void;
  calculateTotal: () => number;
  submitOrder: () => Promise<void>;
  reset: () => void;
}

const useRepeatOrder = ({
  originalOrder,
  onSuccess,
  onError,
}: UseRepeatOrderParams): UseRepeatOrderReturn => {
  const [repeatOrder, setRepeatOrder] = useState<RepeatOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Создание повторного заказа на основе оригинального
  const createRepeatOrder = useCallback(
    (order: Order) => {
      try {
        const repeatItems: RepeatOrderItem[] = order.items.map((item) => {
          // Создаем базовые кастомизации для кофе
          const customizations: OrderCustomization[] = [
            {
              id: 'caramel-syrup',
              name: 'Сироп Карамель',
              type: 'add',
              price: 100,
              isSelected: false,
            },
            {
              id: 'ice',
              name: 'Лёд',
              type: 'remove',
              price: 0,
              isSelected: false,
            },
          ];

          return {
            id: item.id,
            name: item.name,
            basePrice: item.price,
            image: item.image || 'https://example.com/default-coffee.jpg',
            size: 'М - 400 мл', // Размер по умолчанию
            quantity: item.quantity,
            customizations,
            totalPrice: item.price,
          };
        });

        const newRepeatOrder: RepeatOrder = {
          id: `repeat-${order.id}-${Date.now()}`,
          items: repeatItems,
          coffeeShopId: order.coffeeShopId,
          coffeeShopName: order.coffeeShopName,
          totalAmount: order.total,
          originalOrderId: order.id,
        };

        setRepeatOrder(newRepeatOrder);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Ошибка создания повторного заказа';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    },
    [onError]
  );

  // Обновление количества товара
  const updateItemQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (!repeatOrder || quantity < 1) return;

      setRepeatOrder((prev) => {
        if (!prev) return prev;

        const updatedItems = prev.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );

        const totalAmount = updatedItems.reduce(
          (sum, item) => sum + item.totalPrice * item.quantity,
          0
        );

        return {
          ...prev,
          items: updatedItems,
          totalAmount,
        };
      });
    },
    [repeatOrder]
  );

  // Переключение кастомизации
  const toggleCustomization = useCallback(
    (itemId: string, customizationId: string) => {
      if (!repeatOrder) return;

      setRepeatOrder((prev) => {
        if (!prev) return prev;

        const updatedItems = prev.items.map((item) => {
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
        });

        const totalAmount = updatedItems.reduce(
          (sum, item) => sum + item.totalPrice * item.quantity,
          0
        );

        return {
          ...prev,
          items: updatedItems,
          totalAmount,
        };
      });
    },
    [repeatOrder]
  );

  // Расчет общей суммы
  const calculateTotal = useCallback(() => {
    if (!repeatOrder) return 0;
    return repeatOrder.items.reduce(
      (sum, item) => sum + item.totalPrice * item.quantity,
      0
    );
  }, [repeatOrder]);

  // Отправка заказа
  const submitOrder = useCallback(async () => {
    if (!repeatOrder) return;

    setIsLoading(true);
    setError(null);

    try {
      // Здесь должна быть логика отправки заказа на сервер
      // Пока что просто имитируем задержку
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess?.(repeatOrder);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка отправки заказа';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [repeatOrder, onSuccess, onError]);

  // Сброс состояния
  const reset = useCallback(() => {
    setRepeatOrder(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    repeatOrder,
    isLoading,
    error,
    createRepeatOrder,
    updateItemQuantity,
    toggleCustomization,
    calculateTotal,
    submitOrder,
    reset,
  };
};

export default useRepeatOrder;
