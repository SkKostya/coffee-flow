import { Text } from '@rneui/themed';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { Order } from '../../src/favorites';
import { CoffeeShopCard, OrderCard } from '../../src/favorites';
import { useColors, type Product } from '../../src/shared';
import type { CoffeeShop } from '../../src/types';

// Пример данных для демонстрации
const favoriteOrders: Order[] = [
  {
    id: '1',
    items: [
      { id: '1', name: 'Американо', price: 1200, quantity: 1 },
      { id: '2', name: 'Круасан', price: 2090, quantity: 1 },
    ],
    total: 3290,
    status: 'delivered',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T11:00:00'),
    coffeeShopId: '1',
    coffeeShopName: 'Coffee BOOM',
    coffeeShopAddress: 'ул. Каныша Сатпаева, 30/5 к4',
  },
  {
    id: '2',
    items: [
      { id: '3', name: 'Американо', price: 1200, quantity: 1 },
      { id: '4', name: 'Круасан', price: 2090, quantity: 1 },
    ],
    total: 3290,
    status: 'delivered',
    createdAt: new Date('2024-01-14T15:20:00'),
    updatedAt: new Date('2024-01-14T16:00:00'),
    coffeeShopId: '1',
    coffeeShopName: 'Coffee BOOM',
    coffeeShopAddress: 'ул. Каныша Сатпаева, 30/5 к4',
  },
];

const favoriteCoffeeShops: CoffeeShop[] = [
  {
    id: '1',
    name: 'Coffee BOOM',
    rating: 4.5,
    status: 'open',
    address: 'ул. Каныша Сатпаева, 30/5 к4',
    distance: 500,
    image: 'https://example.com/coffee-boom.jpg',
    workingHours: {
      open: '08:00',
      close: '22:00',
    },
  },
  {
    id: '2',
    name: 'URBO coffee',
    rating: 4.3,
    status: 'open',
    address: 'ул. Каныша Сатпаева, 30/5 к4',
    distance: 800,
    image: 'https://example.com/urbo-coffee.jpg',
    workingHours: {
      open: '07:00',
      close: '23:00',
    },
  },
];

const favoriteProducts: Product[] = [
  {
    id: '1',
    name: 'Капучино',
    price: 990,
    image: 'https://example.com/cappuccino1.jpg',
    category: 'coffee',
    isFavorite: true,
    coffeeShopId: '2',
    coffeeShopName: 'URBO coffee',
  },
  {
    id: '2',
    name: 'Капучино',
    price: 990,
    image: 'https://example.com/cappuccino2.jpg',
    category: 'coffee',
    isFavorite: true,
    coffeeShopId: '2',
    coffeeShopName: 'URBO coffee',
  },
  {
    id: '3',
    name: 'Капучино',
    price: 990,
    image: 'https://example.com/cappuccino3.jpg',
    category: 'coffee',
    isFavorite: true,
    coffeeShopId: '2',
    coffeeShopName: 'URBO coffee',
  },
];

export default function FavoritesScreen() {
  const colors = useColors();
  const [expandedCoffeeShops, setExpandedCoffeeShops] = useState<Set<string>>(
    new Set(['2']) // URBO coffee развернута по умолчанию
  );

  const handleToggleExpand = (coffeeShopId: string) => {
    const newExpanded = new Set(expandedCoffeeShops);
    if (newExpanded.has(coffeeShopId)) {
      newExpanded.delete(coffeeShopId);
    } else {
      newExpanded.add(coffeeShopId);
    }
    setExpandedCoffeeShops(newExpanded);
  };

  const handleOpenMenu = (coffeeShop: CoffeeShop) => {
    router.navigate({
      pathname: '/coffee-shops/[id]',
      params: { id: coffeeShop.id },
    });
  };

  const handleOrderDetails = (order: Order) => {
    // Навигация к деталям заказа
    console.log('Детали заказа:', order.id);
  };

  const handleRepeatOrder = (order: Order) => {
    // Навигация к повтору заказа
    router.push('/repeat-order');
  };

  const handleProductPress = (product: Product) => {
    // Навигация к продукту
    console.log('Продукт нажат:', product.name);
  };

  const handleFavoriteToggle = (productId: string) => {
    // Переключение избранного
    console.log('Избранное переключено для продукта:', productId);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Секция "Избранные заказы" */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.texts.secondary }]}>
          Избранные заказы
        </Text>
        {favoriteOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onDetailsPress={() => handleOrderDetails(order)}
            onRepeatPress={() => handleRepeatOrder(order)}
          />
        ))}
      </View>

      {/* Секция "Избранные позиции" */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.texts.secondary }]}>
          Избранные позиции
        </Text>

        {/* Кофейни */}
        {favoriteCoffeeShops.map((coffeeShop) => (
          <CoffeeShopCard
            key={coffeeShop.id}
            coffeeShop={coffeeShop}
            shopProducts={favoriteProducts}
            onFavoriteToggle={handleFavoriteToggle}
            onProductPress={handleProductPress}
            isExpanded={expandedCoffeeShops.has(coffeeShop.id)}
            onToggleExpand={() => handleToggleExpand(coffeeShop.id)}
            onOpenMenu={() => handleOpenMenu(coffeeShop)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
});
