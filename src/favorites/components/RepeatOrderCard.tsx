import { Ionicons } from '@expo/vector-icons';
import { Card, Text } from '@rneui/themed';
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useColors } from '../../shared';
import type { RepeatOrderItem } from '../types';

interface RepeatOrderCardProps {
  item: RepeatOrderItem;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onCustomizationToggle: (itemId: string, customizationId: string) => void;
}

const RepeatOrderCard: React.FC<RepeatOrderCardProps> = ({
  item,
  onQuantityChange,
  onCustomizationToggle,
}) => {
  const colors = useColors();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.backgrounds.neutral,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borders.subtle,
  };

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('ru-RU')} 〒`;
  };

  const handleQuantityDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleCustomizationPress = (customizationId: string) => {
    onCustomizationToggle(item.id, customizationId);
  };

  return (
    <Card containerStyle={cardStyle}>
      {/* Основная информация о продукте */}
      <View style={styles.productHeader}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.texts.primary }]}>
            {item.name}
          </Text>
          <Text style={[styles.productSize, { color: colors.texts.secondary }]}>
            {item.size}
          </Text>
          <Text style={[styles.basePrice, { color: colors.texts.primary }]}>
            {formatPrice(item.basePrice)}
          </Text>
        </View>
      </View>

      {/* Разделитель */}
      <View
        style={[styles.divider, { backgroundColor: colors.borders.subtle }]}
      />

      {/* Дополнительные опции */}
      {item.customizations.map((customization) => (
        <View key={customization.id} style={styles.customizationRow}>
          <TouchableOpacity
            style={styles.customizationButton}
            onPress={() => handleCustomizationPress(customization.id)}
          >
            <View
              style={[
                styles.customizationIcon,
                {
                  backgroundColor:
                    customization.type === 'add'
                      ? colors.success.main
                      : colors.error.main,
                },
              ]}
            >
              <Ionicons
                name={customization.type === 'add' ? 'add' : 'remove'}
                size={16}
                color={colors.texts.primary}
              />
            </View>
            <Text
              style={[
                styles.customizationName,
                { color: colors.texts.secondary },
              ]}
            >
              {customization.name}
            </Text>
          </TouchableOpacity>

          {customization.price > 0 && (
            <Text
              style={[
                styles.customizationPrice,
                { color: colors.primary.main },
              ]}
            >
              +{formatPrice(customization.price)}
            </Text>
          )}
        </View>
      ))}

      {/* Разделитель */}
      <View
        style={[styles.divider, { backgroundColor: colors.borders.subtle }]}
      />

      {/* Количество и итоговая цена */}
      <View style={styles.quantitySection}>
        <View style={styles.priceAndQuantity}>
          <Text style={[styles.itemPrice, { color: colors.texts.secondary }]}>
            {formatPrice(item.totalPrice)} x
          </Text>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                { borderColor: colors.primary.main },
                item.quantity <= 1 && styles.disabledButton,
              ]}
              onPress={handleQuantityDecrease}
              disabled={item.quantity <= 1}
            >
              <Ionicons
                name="remove"
                size={16}
                color={
                  item.quantity <= 1
                    ? colors.texts.disabled
                    : colors.primary.main
                }
              />
            </TouchableOpacity>

            <Text
              style={[styles.quantityText, { color: colors.texts.secondary }]}
            >
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                { borderColor: colors.primary.main },
              ]}
              onPress={handleQuantityIncrease}
            >
              <Ionicons name="add" size={16} color={colors.primary.main} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.totalPrice, { color: colors.texts.primary }]}>
          {formatPrice(item.totalPrice * item.quantity)}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  productHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productSize: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  basePrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  customizationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  customizationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customizationIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  customizationName: {
    fontSize: 14,
    fontWeight: '400',
  },
  customizationPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceAndQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '400',
    marginRight: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RepeatOrderCard;
