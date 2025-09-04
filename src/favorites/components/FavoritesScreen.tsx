import { Text } from '@rneui/themed';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useColors } from '../../shared';
import type { CoffeeShop } from '../../types';
import type { Product } from '../types';
import CoffeeShopCard from './CoffeeShopCard';
import ProductCard from './ProductCard';

interface FavoritesScreenProps {
  coffeeShops: CoffeeShop[];
  products: Product[];
  onCoffeeShopPress: (coffeeShop: CoffeeShop) => void;
  onProductPress: (product: Product) => void;
  onFavoriteToggle: (productId: string) => void;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  coffeeShops,
  products,
  onCoffeeShopPress,
  onProductPress,
  onFavoriteToggle,
}) => {
  const colors = useColors();
  const [expandedCoffeeShops, setExpandedCoffeeShops] = useState<Set<string>>(
    new Set()
  );

  const handleToggleExpand = (coffeeShopId: string) => {
    const newExpanded = new Set(expandedCoffeeShops);
    if (newExpanded.has(coffeeShopId)) {
      newExpanded.delete(coffeeShopId);
    } else {
      newExpanded.add(coffeeShopId);
    }
    setExpandedCoffeeShops(newExpanded);
  };

  const handleOpenMenu = (coffeeShop: CoffeeShop) => {
    onCoffeeShopPress(coffeeShop);
  };

  const handleProductPress = (product: Product) => {
    onProductPress(product);
  };

  const handleFavoritePress = (productId: string) => {
    onFavoriteToggle(productId);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.backgrounds.neutral },
      ]}
    >
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.texts.primary }]}>
          Избранное
        </Text>
      </View>

      {/* Кофейни */}
      {coffeeShops.map((coffeeShop) => (
        <CoffeeShopCard
          key={coffeeShop.id}
          coffeeShop={coffeeShop}
          isExpanded={expandedCoffeeShops.has(coffeeShop.id)}
          onToggleExpand={() => handleToggleExpand(coffeeShop.id)}
          onOpenMenu={() => handleOpenMenu(coffeeShop)}
        />
      ))}

      {/* Продукты */}
      {products.length > 0 && (
        <View style={styles.productsSection}>
          <Text style={[styles.sectionTitle, { color: colors.texts.primary }]}>
            Популярные продукты
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onFavoritePress={() => handleFavoritePress(product.id)}
                onProductPress={() => handleProductPress(product)}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  productsSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  productsContainer: {
    paddingRight: 16,
  },
});

export default FavoritesScreen;
