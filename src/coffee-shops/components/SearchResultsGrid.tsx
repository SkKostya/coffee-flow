import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ProductCard } from '../../shared';
import type { MenuProduct } from '../types';

interface SearchResultsGridProps {
  products: MenuProduct[];
  onProductPress: (product: MenuProduct) => void;
  onFavoritePress: (product: MenuProduct) => void;
}

const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({
  products,
  onProductPress,
  onFavoritePress,
}) => {
  const renderProduct = ({ item }: { item: MenuProduct }) => (
    <View style={styles.productItem}>
      <ProductCard
        product={item}
        isAvailable={item.isAvailable}
        onProductPress={() => onProductPress(item)}
        onFavoritePress={() => onFavoritePress(item)}
      />
    </View>
  );

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
