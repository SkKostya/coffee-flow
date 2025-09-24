// src/cart/components/CartItemOptimized.tsx
// Оптимизированный компонент товара корзины

import { Ionicons } from '@expo/vector-icons';
import { Card } from '@rneui/themed';
import React, { memo, useCallback } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors, useToast } from '../../shared/hooks';
import { useCartItem } from '../../store';
import type { CartItem } from '../../types/cart';
import { formatCustomizations, formatPrice } from '../utils/cartUtils';

interface CartItemOptimizedProps {
  item: CartItem;
  onRemove?: (itemId: string) => void;
}

const CartItemOptimized: React.FC<CartItemOptimizedProps> = memo(
  ({ item, onRemove }) => {
    const colors = useColors();
    const { showSuccess, showError } = useToast();
    const { updateQuantity, removeItem, isLoading } = useCartItem({
      itemId: item.id,
    });

    const handleIncrement = useCallback(async () => {
      if (isLoading) return;
      try {
        await updateQuantity(item.quantity + 1);
      } catch (error) {
        console.error('Failed to increment quantity:', error);
        showError(
          'Ошибка обновления',
          'Не удалось увеличить количество товара'
        );
      }
    }, [
      updateQuantity,
      item.quantity,
      isLoading,
      showSuccess,
      showError,
      item.product.name,
    ]);

    const handleDecrement = useCallback(async () => {
      if (isLoading) return;
      try {
        if (item.quantity > 1) {
          await updateQuantity(item.quantity - 1);
        } else {
          await removeItem();
          showSuccess(
            'Товар удален',
            `Товар "${item.product.name}" удален из корзины`
          );
        }
      } catch (error) {
        console.error('Failed to decrement quantity:', error);
        showError('Ошибка обновления', 'Не удалось изменить количество товара');
      }
    }, [
      updateQuantity,
      removeItem,
      item.quantity,
      isLoading,
      showSuccess,
      showError,
      item.product.name,
    ]);

    const handleRemove = useCallback(async () => {
      try {
        await removeItem();
        onRemove?.(item.id);
        showSuccess(
          'Товар удален',
          `Товар "${item.product.name}" удален из корзины`
        );
      } catch (error) {
        console.error('Failed to remove item:', error);
        showError('Ошибка удаления', 'Не удалось удалить товар из корзины');
      }
    }, [
      item.id,
      onRemove,
      removeItem,
      showSuccess,
      showError,
      item.product.name,
    ]);

    const customizations = formatCustomizations(item.customizations);

    const styles = StyleSheet.create({
      card: {
        margin: 8,
        padding: 16,
        borderRadius: 12,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
      },
      image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
      },
      content: {
        flex: 1,
      },
      name: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.texts.primary,
        marginBottom: 4,
      },
      category: {
        fontSize: 14,
        color: colors.texts.secondary,
        marginBottom: 8,
      },
      customizations: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
      },
      customization: {
        backgroundColor: colors.backgrounds.neutral,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 4,
      },
      customizationText: {
        fontSize: 12,
        color: colors.texts.secondary,
      },
      notes: {
        fontSize: 14,
        color: colors.texts.secondary,
        fontStyle: 'italic',
        marginBottom: 8,
      },
      footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.backgrounds.neutral,
        justifyContent: 'center',
        alignItems: 'center',
      },
      quantity: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.texts.primary,
        marginHorizontal: 16,
        minWidth: 24,
        textAlign: 'center',
      },
      price: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.texts.primary,
      },
      removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.error.light,
        justifyContent: 'center',
        alignItems: 'center',
      },
    });

    return (
      <Card containerStyle={styles.card}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemove}
          disabled={isLoading}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.error.main} />
          ) : (
            <Ionicons name="close" size={16} color={colors.error.main} />
          )}
        </TouchableOpacity>

        <View style={styles.header}>
          {item.product.image && (
            <Image source={{ uri: item.product.image }} style={styles.image} />
          )}
          <View style={styles.content}>
            <Text style={styles.name}>{item.product.name}</Text>
            <Text style={styles.category}>{item.product.category?.nameRu}</Text>

            {customizations.length > 0 && (
              <View style={styles.customizations}>
                {customizations.map((customization, index) => (
                  <View key={index} style={styles.customization}>
                    <Text style={styles.customizationText}>
                      {customization}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {item.notes && <Text style={styles.notes}>"{item.notes}"</Text>}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecrement}
              disabled={item.quantity <= 1 || isLoading}
            >
              <Ionicons
                name="remove"
                size={16}
                color={
                  item.quantity <= 1 || isLoading
                    ? colors.texts.disabled
                    : colors.texts.primary
                }
              />
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncrement}
              disabled={isLoading}
            >
              <Ionicons
                name="add"
                size={16}
                color={isLoading ? colors.texts.disabled : colors.texts.primary}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>{formatPrice(item.totalPrice)}</Text>
        </View>
      </Card>
    );
  }
);

CartItemOptimized.displayName = 'CartItemOptimized';

export default CartItemOptimized;
