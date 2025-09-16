import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ProductCard } from '../../shared';
import { useStickyCart } from '../../store';
import { useAppSelector } from '../../store/hooks';
import { selectStickyCartProductQuantities } from '../../store/selectors/stickyCartSelectors';
import type { MenuProduct } from '../types';

interface SearchResultsGridProps {
  products: MenuProduct[];
  onProductPress: (product: MenuProduct) => void;
  onFavoritePress: (product: MenuProduct) => void;
  onAddToCart?: (product: MenuProduct) => void;
  isProductFavorite: (productId: string) => boolean;
  showAddToCart?: boolean;
}

const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({
  products,
  onProductPress,
  onFavoritePress,
  onAddToCart,
  isProductFavorite,
  showAddToCart = false,
}) => {
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
      <View style={styles.productItem}>
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

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productItem: {
    flex: 1,
    maxWidth: '48%',
    marginBottom: 12,
  },
});

export default SearchResultsGrid;
