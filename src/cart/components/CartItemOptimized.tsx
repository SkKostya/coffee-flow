// src/cart/components/CartItemOptimized.tsx
// Оптимизированный компонент товара корзины

import { Ionicons } from '@expo/vector-icons';
import { Card } from '@rneui/themed';
import React, { memo, useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDebounce, useThrottle } from '../../shared/hooks';
import { useColors } from '../../shared/hooks/useColors';
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
    const { updateQuantity, removeItem } = useCartItem({ itemId: item.id });

    // Дебаунсинг для обновления количества
    const debouncedUpdateQuantity = useDebounce(
      useCallback(
        (quantity: number) => {
          updateQuantity(quantity);
        },
        [updateQuantity]
      ),
      300
    );

    // Троттлинг для кнопок
    const throttledIncrement = useThrottle(
      useCallback(() => {
        updateQuantity(item.quantity + 1);
      }, [updateQuantity, item.quantity]),
      200
    );

    const throttledDecrement = useThrottle(
      useCallback(() => {
        if (item.quantity > 1) {
          updateQuantity(item.quantity - 1);
        } else {
          removeItem();
        }
      }, [updateQuantity, removeItem, item.quantity]),
      200
    );

    const handleRemove = useCallback(() => {
      onRemove?.(item.id);
      removeItem();
    }, [item.id, onRemove, removeItem]);

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
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={16} color={colors.error.main} />
        </TouchableOpacity>

        <View style={styles.header}>
          {item.product.image && (
            <Image source={{ uri: item.product.image }} style={styles.image} />
          )}
          <View style={styles.content}>
            <Text style={styles.name}>{item.product.name}</Text>
            <Text style={styles.category}>{item.product.category}</Text>

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
              onPress={throttledDecrement}
              disabled={item.quantity <= 1}
            >
              <Ionicons
                name="remove"
                size={16}
                color={
                  item.quantity <= 1
                    ? colors.texts.disabled
                    : colors.texts.primary
                }
              />
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={throttledIncrement}
            >
              <Ionicons name="add" size={16} color={colors.texts.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>
            {formatPrice(item.totalPrice * item.quantity)}
          </Text>
        </View>
      </Card>
    );
  }
);

CartItemOptimized.displayName = 'CartItemOptimized';

export default CartItemOptimized;
