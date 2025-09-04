// app/cart.tsx
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Product, RepeatOrderItem } from '../src/shared';
import { ProductCard, RepeatOrderCard, useColors } from '../src/shared';

// Данные корзины с кастомизациями
const cartItems: RepeatOrderItem[] = [
  {
    id: '1',
    name: 'Капучино',
    basePrice: 990,
    image: 'https://images.unsplash.com/photo-1604909052743-92f47e4c4f18',
    size: 'М - 400 мл',
    quantity: 1,
    totalPrice: 1090,
    customizations: [
      {
        id: '1-1',
        name: 'Сироп Карамель',
        type: 'add',
        price: 100,
        isSelected: true,
      },
      {
        id: '1-2',
        name: 'Лёд',
        type: 'remove',
        price: 0,
        isSelected: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Капучино',
    basePrice: 990,
    image: 'https://images.unsplash.com/photo-1604909052743-92f47e4c4f18',
    size: 'М - 400 мл',
    quantity: 2,
    totalPrice: 1090,
    customizations: [
      {
        id: '2-1',
        name: 'Сироп Карамель',
        type: 'add',
        price: 100,
        isSelected: true,
      },
    ],
  },
];

// Рекомендуемые продукты
const suggestedProducts: Product[] = [
  {
    id: '3',
    name: 'Латте',
    price: 990,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d',
    category: 'coffee',
    isFavorite: false,
    coffeeShopId: 'coffee-boom',
    coffeeShopName: 'Coffee BOOM',
  },
  {
    id: '4',
    name: 'Латте',
    price: 990,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d',
    category: 'coffee',
    isFavorite: true,
    coffeeShopId: 'coffee-boom',
    coffeeShopName: 'Coffee BOOM',
  },
  {
    id: '5',
    name: 'Латте',
    price: 990,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d',
    category: 'coffee',
    isFavorite: false,
    coffeeShopId: 'coffee-boom',
    coffeeShopName: 'Coffee BOOM',
  },
];

// Информация о кофейне
const coffeeShop = {
  id: 'coffee-boom',
  name: 'Coffee BOOM',
  address: 'ул. Каныша Сатпаева, 30/5 к4',
  logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
};

export default function CartScreen({ navigation }: any) {
  const colors = useColors();
  const [cartItemsState, setCartItemsState] = useState(cartItems);

  const total = cartItemsState.reduce(
    (sum, item) => sum + item.totalPrice * item.quantity,
    0
  );

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setCartItemsState((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const handleCustomizationToggle = (
    itemId: string,
    customizationId: string
  ) => {
    setCartItemsState((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              customizations: item.customizations.map((customization) =>
                customization.id === customizationId
                  ? { ...customization, isSelected: !customization.isSelected }
                  : customization
              ),
            }
          : item
      )
    );
  };

  const handleProductPress = (product: Product) => {
    // Навигация к детальной странице продукта
    console.log('Product pressed:', product.name);
  };

  const handleFavoritePress = (product: Product) => {
    // Переключение избранного
    console.log('Favorite toggled for:', product.name);
  };

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('ru-RU')} 〒`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.texts.primary,
    },
    coffeeShopSection: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.backgrounds.neutral,
      marginHorizontal: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    coffeeShopInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    coffeeShopLogo: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    coffeeShopDetails: {
      flex: 1,
    },
    coffeeShopName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.texts.primary,
      marginBottom: 2,
    },
    coffeeShopAddress: {
      fontSize: 14,
      color: colors.texts.secondary,
    },
    cartItemsSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.texts.primary,
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    suggestionsSection: {
      marginBottom: 24,
    },
    suggestionsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.texts.primary,
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    suggestionsList: {
      paddingLeft: 16,
    },
    productCard: {
      marginRight: 12,
      width: 160,
    },
    paymentSection: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.backgrounds.neutral,
      marginHorizontal: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    paymentMethod: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    paymentMethodLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.texts.primary,
    },
    paymentMethodValue: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    paymentMethodText: {
      fontSize: 14,
      color: colors.texts.secondary,
      marginRight: 8,
    },
    totalSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.texts.primary,
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.texts.primary,
    },
    payButton: {
      backgroundColor: colors.primary.main,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 20,
    },
    payButtonText: {
      color: colors.texts.primary,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Корзина' }} />

      {/* Информация о кофейне */}
      <View style={styles.coffeeShopSection}>
        <View style={styles.coffeeShopInfo}>
          <Image
            source={{ uri: coffeeShop.logo }}
            style={styles.coffeeShopLogo}
          />
          <View style={styles.coffeeShopDetails}>
            <Text style={styles.coffeeShopName}>{coffeeShop.name}</Text>
            <Text style={styles.coffeeShopAddress}>{coffeeShop.address}</Text>
          </View>
        </View>
      </View>

      {/* Товары в корзине */}
      <View style={styles.cartItemsSection}>
        {cartItemsState.map((item) => (
          <RepeatOrderCard
            key={item.id}
            item={item}
            onQuantityChange={handleQuantityChange}
            onCustomizationToggle={handleCustomizationToggle}
          />
        ))}
      </View>

      {/* Рекомендуемые продукты */}
      <View style={styles.suggestionsSection}>
        <Text style={styles.suggestionsTitle}>Добавьте к своей корзине</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsList}
        >
          {suggestedProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <ProductCard
                product={product}
                onFavoritePress={() => handleFavoritePress(product)}
                onProductPress={() => handleProductPress(product)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Способ оплаты и итоговая сумма */}
      <View style={styles.paymentSection}>
        <View style={styles.paymentMethod}>
          <Text style={styles.paymentMethodLabel}>Способ оплаты</Text>
          <View style={styles.paymentMethodValue}>
            <Text style={styles.paymentMethodText}>Kaspi</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={colors.texts.secondary}
            />
          </View>
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Итого</Text>
          <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
        </View>
      </View>

      {/* Кнопка оплаты */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={() => router.navigate('/checkout')}
      >
        <Text style={styles.payButtonText}>Оплатить</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
