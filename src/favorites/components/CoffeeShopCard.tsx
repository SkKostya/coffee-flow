import { Ionicons } from '@expo/vector-icons';
import { Button, Card, ListItem, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useColors } from '../../shared';
import type { CoffeeShop } from '../../types';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface CoffeeShopCardProps {
  coffeeShop: CoffeeShop;
  shopProducts: Product[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onOpenMenu: () => void;
  onFavoriteToggle: (productId: string) => void;
  onProductPress: (product: Product) => void;
}

const CoffeeShopCard: React.FC<CoffeeShopCardProps> = ({
  coffeeShop,
  shopProducts,
  isExpanded,
  onToggleExpand,
  onOpenMenu,
  onFavoriteToggle,
  onProductPress,
}) => {
  const colors = useColors();

  const cardStyle: ViewStyle = {
    width: '100%',
    backgroundColor: colors.backgrounds.neutral,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borders.subtle,
    margin: 0,
    padding: 16,
  };

  return (
    <ListItem.Accordion
      isExpanded={isExpanded}
      onPress={onToggleExpand}
      containerStyle={styles.accordionContainer}
      content={
        <Card containerStyle={cardStyle}>
          {/* Заголовок кофейни */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View
                style={[
                  styles.logo,
                  { backgroundColor: colors.backgrounds.secondary },
                ]}
              >
                <Ionicons name="cafe" size={20} color={colors.texts.primary} />
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Text
                style={[styles.coffeeShopName, { color: colors.texts.primary }]}
              >
                {coffeeShop.name}
              </Text>
              <Text style={[styles.address, { color: colors.texts.secondary }]}>
                {coffeeShop.address}
              </Text>
            </View>

            <View style={styles.expandButton}>
              <Text style={[styles.itemCount, { color: colors.texts.primary }]}>
                {shopProducts.length}
              </Text>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.texts.primary}
              />
            </View>
          </View>

          {/* Кнопка "Открыть меню" */}
          <Button
            title="Открыть меню"
            type="outline"
            color="primary"
            size="sm"
            buttonStyle={[
              styles.menuButton,
              {
                borderColor: colors.primary.main,
                backgroundColor: colors.backgrounds.neutral,
              },
            ]}
            titleStyle={[styles.buttonText, { color: colors.primary.main }]}
            onPress={onOpenMenu}
          />
        </Card>
      }
    >
      {/* Раскрывающийся контент с продуктами */}
      <View
        style={[
          styles.productsContainer,
          {
            borderColor: colors.borders.subtle,
          },
        ]}
      >
        {shopProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onFavoritePress={() => onFavoriteToggle(product.id)}
            onProductPress={() => onProductPress(product)}
          />
        ))}
        {shopProducts.length % 2 === 1 && (
          <View key="empty-item" style={{ flex: 1, minWidth: 160 }} />
        )}
      </View>
    </ListItem.Accordion>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    marginRight: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  coffeeShopName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    fontWeight: '400',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  itemCount: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  menuButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  productsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 16,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
});

export default CoffeeShopCard;
