# useComponentCart Hook

## Описание

`useComponentCart` - это хук для работы с корзиной в компонентах без API запросов. Он использует только оптимистичные обновления состояния Redux store, что позволяет избежать ошибок авторизации в компонентах, где не требуется загрузка данных с сервера.

## Проблема

Ранее хук `useStickyCartToCart` использовал `useCart`, который автоматически делал API запросы к серверу для загрузки корзины. Это приводило к ошибкам авторизации в компонентах, где пользователь еще не был авторизован.

## Решение

Создан новый хук `useComponentCart`, который:

- Работает только с локальным состоянием Redux store
- Использует оптимистичные обновления (синхронные действия)
- Не делает API запросов
- Подходит для компонентов, где нужна только локальная работа с корзиной

## API

### Возвращаемые значения

```typescript
{
  // Данные
  cart: Cart | null;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  isEmpty: boolean;

  // Состояния
  isLoading: boolean;
  error: string | null;

  // Действия
  addItem: (request: AddCartItemRequest) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;

  // Утилиты
  hasItem: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  getItem: (productId: string) => CartItem | null;
  getCartInfo: () => CartInfo;
}
```

### Пример использования

```typescript
import { useComponentCart } from '@/src/store';

const MyComponent = () => {
  const { addItem, items, totalItems, hasItem } = useComponentCart();

  const handleAddToCart = (productId: string) => {
    addItem({
      productId,
      quantity: 1,
    });
  };

  return (
    <View>
      <Text>Товаров в корзине: {totalItems}</Text>
      {items.map((item) => (
        <Text key={item.id}>{item.productId}</Text>
      ))}
    </View>
  );
};
```

## Обновления

### useStickyCartToCart

Хук `useStickyCartToCart` теперь использует `useComponentCart` вместо `useCart`:

```typescript
// Было
const { addItem, isLoading: cartLoading, error: cartError } = useCart();

// Стало
const { addItem } = useComponentCart();
```

### Преимущества

1. **Нет ошибок авторизации** - не делает API запросов
2. **Быстрая работа** - синхронные операции
3. **Оптимистичные обновления** - UI обновляется мгновенно
4. **Простота использования** - не требует обработки асинхронных состояний

### Ограничения

1. **Только локальное состояние** - изменения не сохраняются на сервере
2. **Нет синхронизации** - не загружает данные с сервера
3. **Временные ID** - товары получают временные ID до синхронизации с сервером

## Когда использовать

- ✅ Компоненты, где нужна только локальная работа с корзиной
- ✅ Sticky cart и подобные UI компоненты
- ✅ Предварительный просмотр корзины
- ✅ Компоненты, где пользователь может быть не авторизован

## Когда НЕ использовать

- ❌ Когда нужна синхронизация с сервером
- ❌ Когда нужны актуальные данные о ценах и наличии
- ❌ Когда нужна персистентность данных между сессиями
