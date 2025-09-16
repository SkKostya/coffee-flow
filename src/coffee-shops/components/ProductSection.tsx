import React from 'react';
import { FlatList, StyleSheet, Text, TextStyle, View } from 'react-native';
import { ProductCard, useColors } from '../../shared';
import { useStickyCart } from '../../store';
import { useAppSelector } from '../../store/hooks';
import { selectStickyCartProductQuantities } from '../../store/selectors/stickyCartSelectors';
import type { MenuProduct } from '../types';
import type { ProductCategory } from '../types/menu';

interface ProductSectionProps {
  category: ProductCategory;
  onProductPress: (product: MenuProduct) => void;
  onFavoritePress: (product: MenuProduct) => void;
  onAddToCart?: (product: MenuProduct) => void;
  isProductFavorite: (productId: string) => boolean;
  showAddToCart?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  category,
  onProductPress,
  onFavoritePress,
  onAddToCart,
  isProductFavorite,
  showAddToCart = false,
}) => {
  const colors = useColors();
  const { incrementQuantity, decrementQuantity, setQuantity } = useStickyCart();

  // Получаем количества товаров напрямую из store для реактивности
  const productQuantities = useAppSelector(selectStickyCartProductQuantities);

  // Функции для управления количеством
  const handleIncrement = (productId: string) => {
    incrementQuantity(productId);
  };

  const handleDecrement = (productId: string) => {
    decrementQuantity(productId);
  };

  const handleAddToCart = (product: MenuProduct) => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    // Устанавливаем количество в 1 при добавлении
    setQuantity(product.id, 1, product.price);
  };

  const renderProduct = ({ item }: { item: MenuProduct }) => {
    const quantity = productQuantities[item.id] || 0;
    const showCounter = quantity > 0;

    return (
      <View style={styles.productContainer}>
        <ProductCard
          product={{
            ...item,
            isFavorite: isProductFavorite(item.id),
          }}
          isAvailable={item.isAvailable}
          onProductPress={() => onProductPress(item)}
          onFavoritePress={() => onFavoritePress(item)}
          onAddToCart={showAddToCart ? () => handleAddToCart(item) : undefined}
          onIncrement={showCounter ? () => handleIncrement(item.id) : undefined}
          onDecrement={showCounter ? () => handleDecrement(item.id) : undefined}
          showAddToCart={showAddToCart}
          showCounter={showCounter}
          quantity={quantity}
        />
      </View>
    );
  };

  const sectionTitleStyle: TextStyle = {
    color: colors.texts.primary,
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, sectionTitleStyle]}>
        {category.name}
      </Text>

      <FlatList
        data={category.products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productsList}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  productsList: {
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productContainer: {
    flex: 1,
    maxWidth: '48%',
  },
});

export default ProductSection;
