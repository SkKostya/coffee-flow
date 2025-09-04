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
  isAvailable?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onFavoritePress,
  onProductPress,
  isAvailable = true,
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
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />

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
});

export default ProductCard;
