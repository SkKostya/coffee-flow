# Favorites Module

Модуль для работы с избранными заказами, кофейнями и продуктами.

## Структура модуля

```
src/favorites/
├── components/           # UI компоненты модуля
│   ├── CoffeeShopCard.tsx      # Карточка кофейни
│   ├── DeleteOrderModal.tsx    # Модальное окно удаления заказа
│   ├── FavoritesScreen.tsx     # Основной экран избранного
│   ├── OrderCard.tsx           # Карточка заказа
│   ├── ProductCard.tsx         # Карточка продукта
│   ├── RepeatOrderCard.tsx     # Карточка товара для повторения заказа
│   └── index.ts               # Экспорты компонентов
├── hooks/                # Хуки модуля
│   ├── useRepeatOrder.ts      # Хук для работы с повторением заказов
│   └── index.ts              # Экспорты хуков
├── types/                # Типы модуля
│   ├── orders.ts              # Типы заказов
│   ├── products.ts            # Типы продуктов
│   ├── repeat-order.ts        # Типы для повторения заказов
│   └── index.ts              # Экспорты типов
└── index.ts              # Публичный API модуля
```

## Компоненты

### CoffeeShopCard

Карточка кофейни с возможностью разворачивания и открытия меню.

**Props:**

- `coffeeShop: CoffeeShop` - данные кофейни
- `isExpanded: boolean` - состояние развернутости
- `onToggleExpand: () => void` - обработчик разворачивания
- `onOpenMenu: () => void` - обработчик открытия меню

### DeleteOrderModal

Модальное окно для подтверждения удаления заказа из избранного.

**Props:**

- `visible: boolean` - видимость модального окна
- `onClose: () => void` - обработчик закрытия
- `onConfirm: () => void` - обработчик подтверждения удаления

### FavoritesScreen

Основной экран для отображения избранных кофеен и продуктов.

**Props:**

- `coffeeShops: CoffeeShop[]` - список избранных кофеен
- `products: Product[]` - список избранных продуктов
- `onCoffeeShopPress: (coffeeShop: CoffeeShop) => void` - обработчик нажатия на кофейню
- `onProductPress: (product: Product) => void` - обработчик нажатия на продукт
- `onFavoriteToggle: (productId: string) => void` - обработчик переключения избранного

### OrderCard

Карточка заказа с кнопками "Подробнее" и "Повторить".

**Props:**

- `order: Order` - данные заказа
- `onDetailsPress: () => void` - обработчик просмотра деталей
- `onRepeatPress: () => void` - обработчик повторения заказа

### ProductCard

Карточка продукта с кнопкой избранного.

**Props:**

- `product: Product` - данные продукта
- `onFavoritePress: () => void` - обработчик переключения избранного
- `onProductPress: () => void` - обработчик нажатия на продукт

### RepeatOrderCard

Карточка товара для настройки повторения заказа с возможностью изменения количества и кастомизации.

**Props:**

- `item: RepeatOrderItem` - данные товара
- `onQuantityChange: (itemId: string, quantity: number) => void` - обработчик изменения количества
- `onCustomizationToggle: (itemId: string, customizationId: string) => void` - обработчик переключения кастомизации

## Хуки

### useRepeatOrder

Хук для управления состоянием и логикой повторения заказов.

**Возвращает:**

- `items: RepeatOrderItem[]` - список товаров
- `updateQuantity: (itemId: string, quantity: number) => void` - функция обновления количества
- `toggleCustomization: (itemId: string, customizationId: string) => void` - функция переключения кастомизации
- `calculateTotalAmount: () => number` - функция расчета общей суммы
- `confirmOrder: () => void` - функция подтверждения заказа

## Типы

### Order

```typescript
interface Order {
  id: string;
  items: OrderItem[];
  coffeeShopId: string;
  coffeeShopName: string;
  coffeeShopAddress: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}
```

### Product

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  isFavorite: boolean;
}
```

### RepeatOrderItem

```typescript
interface RepeatOrderItem {
  id: string;
  name: string;
  basePrice: number;
  image: string;
  size: string;
  quantity: number;
  customizations: OrderCustomization[];
  totalPrice: number;
}
```

## Использование

```typescript
import {
  CoffeeShopCard,
  DeleteOrderModal,
  FavoritesScreen,
  OrderCard,
  ProductCard,
  RepeatOrderCard,
  useRepeatOrder,
} from '@/src/favorites';

// Использование компонентов
<OrderCard
  order={order}
  onDetailsPress={handleDetails}
  onRepeatPress={handleRepeat}
/>;

// Использование хука
const { items, updateQuantity, calculateTotalAmount } = useRepeatOrder();
```

## Особенности

- Все компоненты используют темизированную цветовую систему через хук `useColors()`
- Компоненты адаптированы для мобильных устройств и планшетов
- Соблюдены правила архитектуры проекта Coffee Flow
- Используются React Native Elements для базовых UI компонентов
