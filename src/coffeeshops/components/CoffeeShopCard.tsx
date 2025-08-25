import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  getResponsiveSpacing,
  getResponsiveTypography,
} from '../../shared/constants/responsiveStyles';
import { useColors, useResponsive } from '../../shared/hooks';
import { CoffeeShop } from '../../types';

interface CoffeeShopCardProps {
  coffeeShop: CoffeeShop;
  onPress?: (coffeeShop: CoffeeShop) => void;
}

export const CoffeeShopCard: React.FC<CoffeeShopCardProps> = ({
  coffeeShop,
  onPress,
}) => {
  const colors = useColors();
  const { currentBreakpoint } = useResponsive();
  const spacing = getResponsiveSpacing(currentBreakpoint);
  const typography = getResponsiveTypography(currentBreakpoint);

  const getStatusText = (status: CoffeeShop['status']) => {
    switch (status) {
      case 'open':
        return 'Круглосуточно';
      case 'closed':
        return 'Закрыто';
      case 'closing_soon':
        return 'Закроется через 30 минут';
      default:
        return '';
    }
  };

  const getStatusColor = (status: CoffeeShop['status']) => {
    switch (status) {
      case 'open':
        return colors.success.main;
      case 'closed':
        return colors.error.main;
      case 'closing_soon':
        return colors.status.warning;
      default:
        return colors.texts.secondary;
    }
  };

  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${distance} м`;
    }
    return `${(distance / 1000).toFixed(1)} км`;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgrounds.card,
      borderRadius: 16,
      padding: spacing.md,
      marginBottom: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.shadows.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginRight: spacing.md,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    name: {
      fontSize: typography.h3,
      fontWeight: '600',
      color: colors.texts.primary,
      flex: 1,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgrounds.secondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    rating: {
      fontSize: typography.caption,
      fontWeight: '600',
      color: colors.texts.primary,
      marginRight: 4,
    },
    star: {
      fontSize: typography.caption,
      color: colors.status.warning,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: spacing.xs,
    },
    statusText: {
      fontSize: typography.caption,
      fontWeight: '500',
    },
    address: {
      fontSize: typography.caption,
      color: colors.texts.secondary,
      marginBottom: spacing.xs,
    },
    distance: {
      fontSize: typography.small,
      color: colors.texts.secondary,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(coffeeShop)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: coffeeShop.image }} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {coffeeShop.name}
          </Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{coffeeShop.rating}</Text>
            <Text style={styles.star}>★</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(coffeeShop.status) },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(coffeeShop.status) },
            ]}
          >
            {getStatusText(coffeeShop.status)}
          </Text>
        </View>

        <Text style={styles.address} numberOfLines={1}>
          {coffeeShop.address}
        </Text>

        <Text style={styles.distance}>
          {formatDistance(coffeeShop.distance)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
