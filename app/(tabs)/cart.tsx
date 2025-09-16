// app/cart.tsx
import { CartListOptimized, formatPrice } from '@/src/cart';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Product } from '../../src/shared';
import {
  EmptyState,
  ErrorBoundary,
  ErrorMessage,
  LoadingSpinner,
  ProductCard,
  useColors,
  useToast,
} from '../../src/shared';
import { useCart, useCartErrorHandling } from '../../src/store';

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

const CartScreenContent: React.FC<{ navigation: any }> = ({ navigation }) => {
  const colors = useColors();
  const { showSuccess, showError } = useToast();

  // ===== REDUX ХУКИ =====
  const {
    cart,
    items,
    partner,
    totalAmount,
    totalItems,
    isLoading,
    error,
    isEmpty,
    isReadyForCheckout,
    loadCart,
    clearCart,
    updateItem,
  } = useCart();

  const { error: cartError, clearError, retry } = useCartErrorHandling();

  // ===== ЛОКАЛЬНОЕ СОСТОЯНИЕ =====
  const [refreshing, setRefreshing] = useState(false);

  // ===== ОБРАБОТЧИКИ =====

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    try {
      // Используем updateItem из основного хука useCart
      await updateItem(itemId, { quantity });
      showSuccess('Количество товара обновлено', 'Корзина', 3000);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      showError('Не удалось изменить количество товара');
    }
  };

  const handleCustomizationToggle = async (
    itemId: string,
    customizationId: string
  ) => {
    try {
      // Находим товар в корзине
      const item = items.find((item) => item.id === itemId);
      if (!item) return;

      const currentCustomizations = item.customizations;

      // Переключаем кастомизацию
      const updatedCustomizations = {
        ...currentCustomizations,
        [customizationId]: !currentCustomizations[customizationId],
      };

      await updateItem(itemId, { customizations: updatedCustomizations });
      showSuccess('Настройки товара обновлены', 'Корзина', 3000);
    } catch (error) {
      console.error('Failed to toggle customization:', error);
      showError('Не удалось изменить настройки товара');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadCart();
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Очистить корзину',
      'Вы уверены, что хотите удалить все товары из корзины?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearCart();
              showSuccess('Корзина очищена', 'Корзина', 4000);
            } catch (error) {
              console.error('Failed to clear cart:', error);
              showError('Не удалось очистить корзину');
            }
          },
        },
      ]
    );
  };

  const handleRetry = async () => {
    try {
      await retry();
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  const handleProductPress = (product: Product) => {
    // Навигация к детальной странице продукта
    console.log('Product pressed:', product.name);
  };

  const handleFavoritePress = (product: Product) => {
    // Переключение избранного
    console.log('Favorite toggled for:', product.name);
  };

  // ===== СТИЛИ =====

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
    payButtonDisabled: {
      backgroundColor: colors.texts.disabled,
      opacity: 0.6,
    },
    // Новые стили для состояний
    centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.texts.secondary,
    },
    errorCard: {
      margin: 20,
      padding: 20,
      borderRadius: 12,
    },
    errorTitle: {
      textAlign: 'center',
      marginBottom: 12,
      color: colors.texts.primary,
    },
    errorMessage: {
      textAlign: 'center',
      marginBottom: 20,
      color: colors.texts.secondary,
    },
    retryButton: {
      borderRadius: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.texts.primary,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyMessage: {
      fontSize: 16,
      color: colors.texts.secondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    menuButton: {
      borderRadius: 8,
      paddingHorizontal: 24,
    },
    clearButton: {
      padding: 8,
      marginRight: 8,
    },
    coffeeShopStatus: {
      fontSize: 12,
      color: partner?.isOpen ? colors.success.main : colors.error.main,
      marginTop: 2,
    },
  });

  // ===== СОСТОЯНИЯ ЗАГРУЗКИ И ОШИБОК =====

  if (isLoading && !cart) {
    return (
      <View style={styles.container}>
        <LoadingSpinner
          size="large"
          message="Загрузка корзины..."
          overlay={false}
        />
      </View>
    );
  }

  if (error || cartError) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          error={error || cartError || 'Произошла неизвестная ошибка'}
          onRetry={handleRetry}
          title="Ошибка загрузки"
          showRetry={true}
        />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="cart-outline"
          title="Корзина пуста"
          message="Добавьте товары из меню кофейни"
          actionText="Назад"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary.main]}
          tintColor={colors.primary.main}
        />
      }
    >
      {/* Информация о кофейне */}
      {partner && (
        <View style={styles.coffeeShopSection}>
          <View style={styles.coffeeShopInfo}>
            {partner.logo && (
              <Image
                source={{ uri: partner.logo }}
                style={styles.coffeeShopLogo}
              />
            )}
            <View style={styles.coffeeShopDetails}>
              <Text style={styles.coffeeShopName}>{partner.name}</Text>
              <Text style={styles.coffeeShopAddress}>{partner.address}</Text>
              <Text style={styles.coffeeShopStatus}>
                {partner.isOpen ? 'Открыто' : 'Закрыто'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Товары в корзине */}
      <CartListOptimized onRefresh={handleRefresh} refreshing={refreshing} />

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
          <Text style={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
        </View>
      </View>

      {/* Кнопка оплаты */}
      <TouchableOpacity
        style={[
          styles.payButton,
          !isReadyForCheckout && styles.payButtonDisabled,
        ]}
        onPress={() => isReadyForCheckout && router.navigate('/checkout')}
        disabled={!isReadyForCheckout}
      >
        <Text style={styles.payButtonText}>
          {isLoading ? 'Загрузка...' : `Оплатить ${formatPrice(totalAmount)}`}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default function CartScreen({ navigation }: any) {
  return (
    <ErrorBoundary>
      <CartScreenContent navigation={navigation} />
    </ErrorBoundary>
  );
}
