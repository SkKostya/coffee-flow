// src/cart/components/CartList.tsx
// Список товаров корзины

import React, { memo, useCallback } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import EmptyState from '../../shared/components/EmptyState';
import ErrorMessage from '../../shared/components/ErrorMessage';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import { useColors, useToast } from '../../shared/hooks';
import { useCart } from '../../store';
import CartItemOptimized from './CartItemOptimized';

interface CartListOptimizedProps {
  onRefresh?: () => void;
  refreshing?: boolean;
}

const CartList: React.FC<CartListOptimizedProps> = memo(
  ({ onRefresh, refreshing = false }) => {
    const colors = useColors();
    const { showSuccess, showError } = useToast();
    const { items, isLoading, error, isEmpty, loadCart, removeItem } =
      useCart();

    // Мемоизированные обработчики
    const handleRemoveItem = useCallback(
      async (itemId: string) => {
        try {
          await removeItem(itemId);
          showSuccess('Товар удален', 'Товар успешно удален из корзины');
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
          showError('Ошибка удаления', 'Не удалось удалить товар из корзины');
        }
      },
      [removeItem, showSuccess, showError]
    );

    const handleRefresh = useCallback(async () => {
      if (onRefresh) {
        onRefresh();
      } else {
        await loadCart();
      }
    }, [onRefresh, loadCart]);

    const styles = StyleSheet.create({
      container: {
        flex: 1,
      },
      scrollView: {
        flex: 1,
        paddingTop: 16,
      },
      separator: {
        height: 8,
      },
      header: {
        padding: 16,
        backgroundColor: colors.backgrounds.neutral,
      },
      headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.texts.primary,
      },
    });

    // Обработка состояний загрузки и ошибок
    if (isLoading) {
      return (
        <View style={styles.container}>
          <LoadingSpinner message="Загрузка товаров..." />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.container}>
          <ErrorMessage
            error={error}
            onRetry={handleRefresh}
            title="Ошибка загрузки корзины"
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
            actionText="Перейти к меню"
            onAction={() => {
              // Навигация к меню
              console.log('Navigate to menu');
            }}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Товары в корзине ({items.length})
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary.main]}
              tintColor={colors.primary.main}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {items.map((item, index) => (
            <View key={item.id}>
              <CartItemOptimized item={item} onRemove={handleRemoveItem} />
              {index < items.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
);

CartList.displayName = 'CartList';

export default CartList;
