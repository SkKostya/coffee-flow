// src/cart/components/CartListOptimized.tsx
// Оптимизированный список товаров корзины

import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import EmptyState from '../../shared/components/EmptyState';
import ErrorMessage from '../../shared/components/ErrorMessage';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import { useColors } from '../../shared/hooks/useColors';
import { useCart } from '../../store';
import type { CartItem } from '../../types/cart';
import CartItemOptimized from './CartItemOptimized';

interface CartListOptimizedProps {
  onRefresh?: () => void;
  refreshing?: boolean;
}

const CartListOptimized: React.FC<CartListOptimizedProps> = memo(
  ({ onRefresh, refreshing = false }) => {
    const colors = useColors();
    const { items, isLoading, error, isEmpty, loadCart } = useCart();

    // Мемоизированные данные для FlatList
    const listData = useMemo(() => items, [items]);

    // Мемоизированные обработчики
    const handleRemoveItem = useCallback((itemId: string) => {
      // Логика удаления уже в CartItemOptimized
      console.log('Removing item:', itemId);
    }, []);

    const handleRefresh = useCallback(async () => {
      if (onRefresh) {
        onRefresh();
      } else {
        await loadCart();
      }
    }, [onRefresh, loadCart]);

    // Мемоизированный рендер элемента
    const renderItem = useCallback(
      ({ item }: { item: CartItem }) => (
        <CartItemOptimized item={item} onRemove={handleRemoveItem} />
      ),
      [handleRemoveItem]
    );

    // Мемоизированный ключ элемента
    const keyExtractor = useCallback((item: CartItem) => item.id, []);

    // Мемоизированный разделитель
    const ItemSeparator = useCallback(
      () => <View style={styles.separator} />,
      []
    );

    // Мемоизированный пустой компонент
    const ListEmptyComponent = useMemo(() => {
      if (isLoading) {
        return <LoadingSpinner message="Загрузка товаров..." />;
      }

      if (error) {
        return (
          <ErrorMessage
            error={error}
            onRetry={handleRefresh}
            title="Ошибка загрузки корзины"
          />
        );
      }

      if (isEmpty) {
        return (
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
        );
      }

      return null;
    }, [isLoading, error, isEmpty, handleRefresh]);

    const styles = StyleSheet.create({
      container: {
        flex: 1,
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

    return (
      <View style={styles.container}>
        {!isEmpty && (
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Товары в корзине ({items.length})
            </Text>
          </View>
        )}

        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary.main]}
              tintColor={colors.primary.main}
            />
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={5}
          getItemLayout={(data, index) => ({
            length: 120, // Примерная высота элемента
            offset: 120 * index,
            index,
          })}
        />
      </View>
    );
  }
);

CartListOptimized.displayName = 'CartListOptimized';

export default CartListOptimized;
