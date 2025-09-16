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
import { useColors } from '../hooks';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onFavoritePress: () => void;
  onProductPress: () => void;
  onAddToCart?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  isAvailable?: boolean;
  showAddToCart?: boolean;
  showCounter?: boolean;
  quantity?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onFavoritePress,
  onProductPress,
  onAddToCart,
  onIncrement,
  onDecrement,
  isAvailable = true,
  showAddToCart = false,
  showCounter = false,
  quantity = 0,
}) => {
  const colors = useColors();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.backgrounds.neutral,
    borderRadius: 12,
    margin: 0,
    padding: 12,
    opacity: isAvailable ? 1 : 0.5,
  };

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('ru-RU')} 〒`;
  };

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        minWidth: 160,
      }}
      onPress={onProductPress}
    >
      <Card containerStyle={cardStyle}>
        {/* Изображение продукта */}
        <View style={styles.imageContainer}>
          {product.image && (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          )}

          {/* Кнопка избранного */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onFavoritePress}
          >
            <Ionicons
              name={product.isFavorite ? 'heart' : 'heart-outline'}
              size={16}
              color={
                product.isFavorite ? colors.error.main : colors.texts.primary
              }
            />
          </TouchableOpacity>
        </View>

        {/* Информация о продукте */}
        <View>
          <Text style={[styles.productName, { color: colors.texts.primary }]}>
            {product.name}
          </Text>

          <View style={styles.priceContainer}>
            {isAvailable ? (
              <Text style={[styles.price, { color: colors.texts.primary }]}>
                {formatPrice(product.price)}
              </Text>
            ) : (
              <Text
                style={[
                  styles.unavailableText,
                  { color: colors.texts.secondary },
                ]}
              >
                Нет в наличии
              </Text>
            )}
          </View>

          {/* Кнопка добавления в корзину или счетчик */}
          {showAddToCart && isAvailable && onAddToCart && !showCounter && (
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                { backgroundColor: colors.primary.main },
              ]}
              onPress={onAddToCart}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.addToCartText, { color: colors.texts.primary }]}
              >
                Добавить
              </Text>
            </TouchableOpacity>
          )}

          {/* Счетчик количества */}
          {showCounter && isAvailable && onIncrement && onDecrement && (
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={[
                  styles.counterButton,
                  { backgroundColor: colors.backgrounds.elevated },
                  { borderColor: colors.borders.primary },
                ]}
                onPress={onDecrement}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.counterButtonText,
                    { color: colors.texts.primary },
                  ]}
                >
                  -
                </Text>
              </TouchableOpacity>

              <Text
                style={[styles.counterText, { color: colors.texts.primary }]}
              >
                {quantity}
              </Text>

              <TouchableOpacity
                style={[
                  styles.counterButton,
                  { backgroundColor: colors.primary.main },
                ]}
                onPress={onIncrement}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.counterButtonText,
                    { color: colors.texts.primary },
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
  },
  unavailableText: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  addToCartButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 14,
    fontWeight: '600',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  counterButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  counterText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
});

export default ProductCard;
