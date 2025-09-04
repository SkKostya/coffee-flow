import React from 'react';
import { FlatList, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ProductCard, useColors } from '../../shared';
import type { MenuProduct, ProductCategory } from '../types';

interface ProductSectionProps {
  category: ProductCategory;
  onProductPress: (product: MenuProduct) => void;
  onFavoritePress: (product: MenuProduct) => void;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  category,
  onProductPress,
  onFavoritePress,
}) => {
  const colors = useColors();

  const renderProduct = ({ item }: { item: MenuProduct }) => (
    <View style={styles.productContainer}>
      <ProductCard
        product={item}
        isAvailable={item.isAvailable}
        onProductPress={() => onProductPress(item)}
        onFavoritePress={() => onFavoritePress(item)}
      />
    </View>
  );

  const sectionTitleStyle: ViewStyle = {
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
