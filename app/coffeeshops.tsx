import { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CoffeeShopCard,
  MapPlaceholder,
  SearchBar,
  useCoffeeShops,
} from '../src/coffeeshops';
import { BottomNavigation } from '../src/shared/components';
import {
  getResponsiveSpacing,
  getResponsiveTypography,
} from '../src/shared/constants/responsiveStyles';
import { useColors, useResponsive } from '../src/shared/hooks';
import { CoffeeShop, ViewMode } from '../src/types';

// Моковые данные для демонстрации
const mockCoffeeShops: CoffeeShop[] = [
  {
    id: '1',
    name: 'Coffee BOOM',
    rating: 4.6,
    status: 'open',
    address: 'ул. Каныша Сатпаева, 30/5 к4',
    distance: 85,
    image: 'https://via.placeholder.com/80x80/E08D3C/FFFFFF?text=CB',
  },
  {
    id: '2',
    name: 'URBO coffee',
    rating: 0,
    status: 'closing_soon',
    address: 'ул. Каныша Сатпаева, 30/5 к4',
    distance: 100,
    image: 'https://via.placeholder.com/80x80/3D8FE1/FFFFFF?text=UC',
  },
  {
    id: '3',
    name: 'Coffee BOOM',
    rating: 4.6,
    status: 'closed',
    address: 'ул. Каныша Сатпаева, 30/5 к4',
    distance: 201,
    image: 'https://via.placeholder.com/80x80/E08D3C/FFFFFF?text=CB',
    workingHours: { open: '07:00', close: '23:00' },
  },
  {
    id: '4',
    name: 'Coffee BOOM',
    rating: 4.6,
    status: 'open',
    address: 'ул. Каныша Сатпаева, 30/5 к4',
    distance: 240,
    image: 'https://via.placeholder.com/80x80/E08D3C/FFFFFF?text=CB',
  },
  {
    id: '5',
    name: 'Coffee BOOM',
    rating: 4.6,
    status: 'open',
    address: 'ул. Каныша Сатпаева, 30/5 к4',
    distance: 240,
    image: 'https://via.placeholder.com/80x80/E08D3C/FFFFFF?text=CB',
  },
];

export default function CoffeeShopsScreen() {
  const colors = useColors();
  const { currentBreakpoint } = useResponsive();
  const spacing = getResponsiveSpacing(currentBreakpoint);
  const typography = getResponsiveTypography(currentBreakpoint);

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeTab, setActiveTab] = useState<'map' | 'favorites' | 'profile'>(
    'map'
  );

  // Используем хук модуля для управления данными кофеен
  const {
    filteredCoffeeShops,
    searchQuery,
    setSearchQuery,
    searchRadius,
    setSearchRadius,
  } = useCoffeeShops({
    initialShops: mockCoffeeShops,
  });

  const handleCoffeeShopPress = (coffeeShop: CoffeeShop) => {
    console.log('Selected coffee shop:', coffeeShop.name);
    // Здесь будет навигация к деталям кофейни
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'map' : 'list');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>☕</Text>
      <Text style={styles.emptyStateTitle}>Кофейни не найдены</Text>
      <Text style={styles.emptyStateSubtitle}>
        Попробуйте изменить параметры поиска{'\n'}или увеличить радиус поиска
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.locationContainer}>
        <Text style={styles.locationIcon}>📍</Text>
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationCity}>Алматы</Text>
          <TouchableOpacity>
            <Text style={styles.locationChange}>Изменить город</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationIcon: {
      fontSize: typography.body,
      marginRight: spacing.xs,
    },
    locationTextContainer: {
      alignItems: 'flex-start',
    },
    locationCity: {
      fontSize: typography.h3,
      fontWeight: '600',
      color: colors.texts.primary,
    },
    locationChange: {
      fontSize: typography.small,
      color: colors.texts.secondary,
      textDecorationLine: 'underline',
    },
    menuButton: {
      padding: spacing.xs,
    },
    menuIcon: {
      fontSize: typography.h2,
      color: colors.texts.primary,
    },
    content: {
      flex: 1,
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: spacing.md,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyStateIcon: {
      fontSize: 64,
      marginBottom: spacing.lg,
    },
    emptyStateTitle: {
      fontSize: typography.h2,
      fontWeight: '600',
      color: colors.texts.primary,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    emptyStateSubtitle: {
      fontSize: typography.body,
      color: colors.texts.secondary,
      textAlign: 'center',
      lineHeight: typography.body * 1.4,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={
          colors.backgrounds.primary === '#242424'
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={colors.backgrounds.primary}
      />

      {renderHeader()}

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        radius={searchRadius}
        onRadiusChange={setSearchRadius}
        placeholder="Поиск кофеен..."
      />

      <View style={styles.content}>
        {viewMode === 'list' ? (
          <View style={styles.listContainer}>
            {filteredCoffeeShops.length > 0 ? (
              <FlatList
                data={filteredCoffeeShops}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <CoffeeShopCard
                    coffeeShop={item}
                    onPress={handleCoffeeShopPress}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: spacing.xl,
                }}
              />
            ) : (
              renderEmptyState()
            )}
          </View>
        ) : (
          <MapPlaceholder
            onToggleView={toggleViewMode}
            showCoffeeShops={filteredCoffeeShops.length > 0}
          />
        )}
      </View>

      <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}
