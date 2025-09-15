import { Text } from '@rneui/themed';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import {
  CoffeeShopCard,
  EmptyFavoritesState,
  ErrorState,
  OrderCard,
} from '../../src/favorites';
import { useColors } from '../../src/shared';
import {
  useFavoriteOrders,
  useFavoriteProducts,
  useFavorites,
} from '../../src/store';
import type {
  CoffeeShop,
  FavoriteOrderWithShop,
  FavoriteProductWithShop,
} from '../../src/types';

// Временные данные для демонстрации (будут заменены на реальные данные из Redux)
const mockCoffeeShops: CoffeeShop[] = [
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

export default function FavoritesScreen() {
  const colors = useColors();
  const [expandedCoffeeShops, setExpandedCoffeeShops] = useState<Set<string>>(
    new Set(['2']) // URBO coffee развернута по умолчанию
  );

  // Redux хуки
  const { favorites, isLoading, error, loadFavorites, clearError } =
    useFavorites();
  const { toggleProduct } = useFavoriteProducts();
  const { toggleOrder } = useFavoriteOrders();

  // Получаем данные через селекторы
  const favoriteProducts = useFavorites()
    .favorites.filter((fav) => fav.type === 'product' && fav.product)
    .map((fav) => ({
      ...fav.product!,
      coffeeShopId: fav.product!.partner.id,
      coffeeShopName: fav.product!.partner.name,
      isFavorite: true,
    }));

  const favoriteOrders = useFavorites()
    .favorites.filter((fav) => fav.type === 'order' && fav.order)
    .map((fav) => ({
      ...fav.order!,
      coffeeShopId: fav.order!.partner.id,
      coffeeShopName: fav.order!.partner.name,
      coffeeShopAddress: '', // Нужно будет получать из API кофеен
      items: [], // Нужно будет получать из API заказов
      createdAt: new Date(fav.createdAt),
      updatedAt: new Date(fav.createdAt),
    }));

  // Автоматическая загрузка при монтировании (без retry)
  useEffect(() => {
    loadFavorites();
  }, []); // Пустой массив зависимостей - выполняется только при монтировании

  // Обработка ошибок
  useEffect(() => {
    if (error) {
      console.error('Ошибка загрузки избранного:', error);
      // Здесь можно показать уведомление об ошибке
    }
  }, [error]);

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

  const handleOrderDetails = (order: FavoriteOrderWithShop) => {
    // Навигация к деталям заказа
    console.log('Детали заказа:', order.id);
  };

  const handleRepeatOrder = (order: FavoriteOrderWithShop) => {
    // Навигация к повтору заказа
    router.push('/repeat-order');
  };

  const handleProductPress = (product: FavoriteProductWithShop) => {
    // Навигация к продукту
    console.log('Продукт нажат:', product.name);
  };

  const handleFavoriteToggle = async (productId: string) => {
    try {
      await toggleProduct(productId);
    } catch (err) {
      console.error('Ошибка переключения избранного:', err);
    }
  };

  const handleRefresh = () => {
    loadFavorites();
  };

  // Группировка продуктов по кофейням
  const productsByShop = favoriteProducts.reduce((acc, product) => {
    const shopId = product.coffeeShopId;
    if (!acc[shopId]) {
      acc[shopId] = {
        shop: mockCoffeeShops.find((shop) => shop.id === shopId) || {
          id: shopId,
          name: product.coffeeShopName,
          rating: 0,
          status: 'open' as const,
          address: '',
          distance: 0,
          image: '',
          workingHours: { open: '00:00', close: '00:00' },
        },
        products: [],
      };
    }
    acc[shopId].products.push(product);
    return acc;
  }, {} as Record<string, { shop: CoffeeShop; products: FavoriteProductWithShop[] }>);

  // Проверка на пустое состояние - показываем только если загрузка завершена и данных нет
  const isEmpty = favorites.length === 0 && !isLoading;

  // Если есть ошибка
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState
          error={error}
          onRetry={handleRefresh}
          onDismiss={clearError}
        />
      </View>
    );
  }

  // Если пустое состояние
  if (isEmpty) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyFavoritesState type="all" onActionPress={() => loadFavorites()} />
      </View>
    );
  }

  // Если загружается и нет данных - показываем индикатор загрузки
  if (isLoading && favorites.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.texts.secondary }]}>
            Загрузка избранного...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={handleRefresh}
          colors={[colors.primary.main]}
          tintColor={colors.primary.main}
        />
      }
    >
      {/* Секция "Избранные заказы" */}
      {favoriteOrders.length > 0 && (
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: colors.texts.secondary }]}
          >
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
      )}

      {/* Секция "Избранные позиции" */}
      {favoriteProducts.length > 0 && (
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: colors.texts.secondary }]}
          >
            Избранные позиции
          </Text>

          {/* Кофейни */}
          {Object.values(productsByShop).map(({ shop, products }) => (
            <CoffeeShopCard
              key={shop.id}
              coffeeShop={shop}
              shopProducts={products}
              onFavoriteToggle={handleFavoriteToggle}
              onProductPress={handleProductPress}
              isExpanded={expandedCoffeeShops.has(shop.id)}
              onToggleExpand={() => handleToggleExpand(shop.id)}
              onOpenMenu={() => handleOpenMenu(shop)}
            />
          ))}
        </View>
      )}
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
  loadingContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
