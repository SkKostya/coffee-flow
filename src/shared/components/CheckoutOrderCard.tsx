import { Card, Text } from '@rneui/themed';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { formatPrice } from '../../cart/utils/cartUtils';
import type { CartItem } from '../../types/cart';
import { useColors } from '../hooks/useColors';

interface CheckoutOrderCardProps {
  item: CartItem;
}

const CheckoutOrderCard: React.FC<CheckoutOrderCardProps> = ({ item }) => {
  const colors = useColors();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.backgrounds.neutral,
      borderRadius: 12,
      marginHorizontal: 0,
      marginBottom: 12,
      padding: 16,
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
    size: {
      fontSize: 14,
      color: colors.texts.secondary,
      marginBottom: 8,
    },
    customizations: {
      marginBottom: 8,
    },
    customization: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    customizationText: {
      fontSize: 14,
      color: colors.texts.secondary,
      marginLeft: 4,
    },
    addText: {
      color: colors.success.main,
    },
    removeText: {
      color: colors.error.main,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    quantity: {
      fontSize: 14,
      color: colors.texts.secondary,
    },
    price: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.texts.primary,
    },
    totalPrice: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.texts.primary,
      marginTop: 4,
    },
  });

  const formatCustomizations = () => {
    const customizations: React.ReactNode[] = [];

    if (item.customizations) {
      Object.entries(item.customizations).forEach(([key, value]) => {
        if (value) {
          customizations.push(
            <View key={key} style={styles.customization}>
              <Text style={[styles.customizationText, styles.addText]}>
                + {key}
              </Text>
            </View>
          );
        } else {
          customizations.push(
            <View key={key} style={styles.customization}>
              <Text style={[styles.customizationText, styles.removeText]}>
                — {key}
              </Text>
            </View>
          );
        }
      });
    }

    return customizations;
  };

  const getSizeText = () => {
    // Предполагаем, что размер хранится в customizations или отдельном поле
    // Здесь можно добавить логику для определения размера
    return 'М - 400 мл';
  };

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.header}>
        {item.product.image && (
          <Image source={{ uri: item.product.image }} style={styles.image} />
        )}
        <View style={styles.content}>
          <Text style={styles.name}>{item.product.name}</Text>
          <Text style={styles.size}>{getSizeText()}</Text>

          <View style={styles.customizations}>{formatCustomizations()}</View>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>
            {formatPrice(item.totalPrice * item.quantity)}
          </Text>
          <Text style={styles.quantity}>× {item.quantity} шт</Text>
        </View>
        <Text style={styles.totalPrice}>
          {formatPrice(item.totalPrice * item.quantity)}
        </Text>
      </View>
    </Card>
  );
};

export default CheckoutOrderCard;
