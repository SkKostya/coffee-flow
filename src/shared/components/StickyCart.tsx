import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useStickyCart } from '../../store';
import { useColors } from '../hooks/useColors';

interface SelectedProductData {
  id: string;
  name: string;
  price: number;
  image?: string;
  coffeeShopName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface StickyCartProps {
  onAddToCart: () => void;
  onViewCart: () => void;
  onClear: () => void;
  isLoading?: boolean;
  error?: string | null;
  // Данные о продуктах для отображения подробностей
  products?: Array<{
    id: string;
    name: string;
    price: number;
    image?: string;
    coffeeShopName: string;
  }>;
}

const StickyCart: React.FC<StickyCartProps> = ({
  onAddToCart,
  onViewCart,
  onClear,
  isLoading = false,
  error = null,
  products = [],
}) => {
  const colors = useColors();
  const {
    totalAmount,
    totalItems,
    isEmpty,
    selectedProducts,
    productQuantities,
    productPrices,
  } = useStickyCart();

  // Состояние для раскрытия подробностей
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  // Функция для переключения раскрытия
  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);

    Animated.timing(animationValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Получаем данные о выбранных продуктах
  const selectedProductsData = selectedProducts
    .map((productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return null;

      return {
        ...product,
        quantity: productQuantities[productId] || 0,
        unitPrice: productPrices[productId] || product.price,
        totalPrice:
          (productQuantities[productId] || 0) *
          (productPrices[productId] || product.price),
      };
    })
    .filter(Boolean) as SelectedProductData[];

  // Не показываем компонент, если корзина пуста или данные не загружены
  if (isEmpty || totalAmount === undefined || totalItems === undefined) {
    return null;
  }

  const formatPrice = (price: number): string => {
    // Убираем лишние нули после запятой
    const formattedPrice = Math.round(price).toLocaleString('ru-RU');
    return `${formattedPrice} ₸`;
  };

  const containerStyle: ViewStyle = {
    backgroundColor: colors.backgrounds.elevated,
    borderTopColor: colors.borders.primary,
    borderTopWidth: 1,
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: colors.primary.main,
  };

  const clearButtonStyle: ViewStyle = {
    backgroundColor: colors.backgrounds.elevated,
    borderColor: colors.borders.primary,
    borderWidth: 1,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Кнопка раскрытия по центру */}
      <TouchableOpacity
        style={[
          styles.expandButton,
          { backgroundColor: colors.backgrounds.elevated },
        ]}
        onPress={toggleExpanded}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isExpanded ? 'chevron-down' : 'chevron-up'}
          size={20}
          color={colors.texts.secondary}
        />
      </TouchableOpacity>

      {/* Раскрывающийся список продуктов */}
      <Animated.View
        style={[
          styles.expandedContent,
          {
            maxHeight: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200], // Максимальная высота для списка
            }),
            opacity: animationValue,
          },
        ]}
      >
        <ScrollView
          style={styles.productsList}
          showsVerticalScrollIndicator={false}
        >
          {selectedProductsData.map((product: SelectedProductData) => (
            <View
              key={product.id}
              style={[
                styles.productItem,
                { borderBottomColor: colors.borders.primary },
              ]}
            >
              <View style={styles.productInfo}>
                <Text
                  style={[styles.productName, { color: colors.texts.primary }]}
                >
                  {product.name}
                </Text>
                <Text
                  style={[
                    styles.productShop,
                    { color: colors.texts.secondary },
                  ]}
                >
                  {product.coffeeShopName}
                </Text>
                <Text
                  style={[
                    styles.productQuantity,
                    { color: colors.texts.secondary },
                  ]}
                >
                  Количество: {product.quantity}
                </Text>
              </View>
              <View style={styles.productPrice}>
                <Text
                  style={[
                    styles.productUnitPrice,
                    { color: colors.texts.secondary },
                  ]}
                >
                  {formatPrice(product.unitPrice)} × {product.quantity}
                </Text>
                <Text
                  style={[
                    styles.productTotalPrice,
                    { color: colors.texts.primary },
                  ]}
                >
                  {formatPrice(product.totalPrice)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      <View style={styles.content}>
        {/* Левая часть - общая сумма */}
        <View style={styles.totalSection}>
          <Text style={[styles.totalLabel, { color: colors.texts.secondary }]}>
            Итого
          </Text>
          <Text style={[styles.totalAmount, { color: colors.texts.primary }]}>
            {formatPrice(totalAmount)}
          </Text>
        </View>

        {/* Правая часть - кнопка очистки */}
        <TouchableOpacity
          style={[styles.clearButton, clearButtonStyle]}
          onPress={onClear}
          activeOpacity={0.8}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={colors.texts.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Кнопка добавления в корзину на всю ширину */}
      <TouchableOpacity
        style={[styles.addButtonFullWidth, buttonStyle]}
        onPress={onAddToCart}
        activeOpacity={0.8}
      >
        <Text style={[styles.addButtonText, { color: colors.texts.primary }]}>
          Добавить в корзину
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 34, // Учитываем safe area
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 1000,
  },
  expandButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expandedContent: {
    overflow: 'hidden',
    marginBottom: 8,
  },
  productsList: {
    maxHeight: 200,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productShop: {
    fontSize: 14,
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 12,
  },
  productPrice: {
    alignItems: 'flex-end',
  },
  productUnitPrice: {
    fontSize: 12,
    marginBottom: 2,
  },
  productTotalPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },
  addButtonFullWidth: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StickyCart;
