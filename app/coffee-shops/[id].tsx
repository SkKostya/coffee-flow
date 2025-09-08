import { router, Stack } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { MenuProduct } from '../../src/coffee-shops';
import {
  calculateSectionOffsets,
  CategoryHeader,
  CoffeeShopHeader,
  createSearchDebounce,
  createSearchState,
  EmptySearchResults,
  getActiveCategoryByScrollPosition,
  mockCategories,
  mockCoffeeShop,
  mockProducts,
  ProductSection,
  scrollToCategory,
  SearchHeader,
  SearchResultsGrid,
} from '../../src/coffee-shops';
import type { CategoryTab } from '../../src/coffee-shops/types/categories';
import { useColors } from '../../src/shared';

// Состояние компонента
interface CoffeeShopScreenState {
  searchQuery: string;
  isSearchActive: boolean;
  activeCategoryId: string;
  categories: CategoryTab[];
  filteredProducts: MenuProduct[];
  scrollY: number;
  sectionOffsets: Record<string, number>;
}

export default function CoffeeShopScreen() {
  const colors = useColors();
  const scrollViewRef = useRef<ScrollView>(null);

  // Состояние компонента
  const [state, setState] = useState<CoffeeShopScreenState>({
    searchQuery: '',
    isSearchActive: false,
    activeCategoryId: mockCategories[0]?.id || '',
    categories: mockCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      isActive: cat.id === (mockCategories[0]?.id || ''),
      isVisible: cat.products.length > 0,
    })),
    filteredProducts: [],
    scrollY: 0,
    sectionOffsets: {},
  });

  // Дебаунс функция для поиска
  const debouncedSearch = useRef(
    createSearchDebounce((query: string) => {
      const searchState = createSearchState(query, mockProducts);
      setState((prev) => ({
        ...prev,
        searchQuery: query,
        isSearchActive: searchState.isActive,
        filteredProducts: searchState.filteredProducts,
      }));
    }, 300)
  ).current;

  // Обработчики событий
  const handleSearchChange = useCallback(
    (query: string) => {
      // Обновляем query сразу для отзывчивости UI
      setState((prev) => ({
        ...prev,
        searchQuery: query,
      }));

      // Дебаунс для поиска
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const handleClearSearch = useCallback(() => {
    setState((prev) => ({
      ...prev,
      searchQuery: '',
      isSearchActive: false,
      filteredProducts: [],
    }));
  }, []);

  const handleSearchBackPress = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSearchActive: false,
      searchQuery: '',
      filteredProducts: [],
    }));
  }, []);

  const handleProductPress = useCallback((product: MenuProduct) => {
    // Навигация к детальной странице продукта
    console.log('Product pressed:', product.name);
  }, []);

  const handleFavoritePress = useCallback((product: MenuProduct) => {
    // Переключение избранного
    console.log('Favorite toggled for:', product.name);
  }, []);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const handleSearchPress = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSearchActive: !prev.isSearchActive,
      searchQuery: prev.isSearchActive ? '' : prev.searchQuery,
      filteredProducts: prev.isSearchActive ? [] : prev.filteredProducts,
    }));
  }, []);

  // Инициализация смещений секций
  useEffect(() => {
    const offsets = calculateSectionOffsets(
      mockCategories,
      100, // header height
      60, // category header height
      200 // interior image height
    );

    setState((prev) => ({
      ...prev,
      sectionOffsets: offsets,
    }));
  }, []);

  // Обработчик скролла для автоматического переключения категорий
  const handleScroll = useCallback((event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    setState((prev) => {
      const newActiveCategoryId = getActiveCategoryByScrollPosition(
        scrollY,
        mockCategories,
        prev.sectionOffsets
      );

      // Обновляем активную категорию только если она изменилась
      if (newActiveCategoryId !== prev.activeCategoryId) {
        return {
          ...prev,
          scrollY,
          activeCategoryId: newActiveCategoryId,
          categories: prev.categories.map((cat) => ({
            ...cat,
            isActive: cat.id === newActiveCategoryId,
          })),
        };
      }

      return {
        ...prev,
        scrollY,
      };
    });
  }, []);

  // Обновленный обработчик нажатия на категорию с прокруткой
  const handleCategoryPressWithScroll = useCallback((categoryId: string) => {
    setState((prev) => {
      // Прокручиваем к секции
      scrollToCategory(categoryId, prev.sectionOffsets, scrollViewRef);

      return {
        ...prev,
        activeCategoryId: categoryId,
        categories: prev.categories.map((cat) => ({
          ...cat,
          isActive: cat.id === categoryId,
        })),
      };
    });
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
    },
    interiorImage: {
      width: '100%',
      height: 200,
      marginBottom: 16,
    },
    content: {
      flex: 1,
    },
    searchResults: {
      paddingHorizontal: 16,
    },
    searchResultsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.texts.primary,
      marginBottom: 12,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Основная шапка кофейни */}
      {!state.isSearchActive && (
        <CoffeeShopHeader
          name={mockCoffeeShop.name}
          address={mockCoffeeShop.address}
          logo={mockCoffeeShop.logo}
          onBackPress={handleBackPress}
          onSearchPress={handleSearchPress}
        />
      )}

      {/* Поисковая шапка */}
      {state.isSearchActive && (
        <SearchHeader
          searchQuery={state.searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          onBackPress={handleSearchBackPress}
          placeholder="Поиск по меню..."
        />
      )}

      {/* Горизонтальный скролл категорий */}
      {!state.isSearchActive && (
        <CategoryHeader
          categories={state.categories}
          activeCategoryId={state.activeCategoryId}
          onCategoryPress={handleCategoryPressWithScroll}
        />
      )}

      {/* Основной контент */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Изображение интерьера кофейни */}
        {!state.isSearchActive && (
          <Image
            source={{ uri: mockCoffeeShop.interiorImage }}
            style={styles.interiorImage}
            resizeMode="cover"
          />
        )}

        {/* Результаты поиска */}
        {state.isSearchActive && (
          <View style={styles.searchResults}>
            {state.filteredProducts.length > 0 ? (
              <>
                <Text style={styles.searchResultsTitle}>
                  Результаты поиска ({state.filteredProducts.length})
                </Text>
                <SearchResultsGrid
                  products={state.filteredProducts}
                  onProductPress={handleProductPress}
                  onFavoritePress={handleFavoritePress}
                />
              </>
            ) : (
              <EmptySearchResults
                searchQuery={state.searchQuery}
                onClearSearch={handleClearSearch}
              />
            )}
          </View>
        )}

        {/* Секции продуктов по категориям */}
        {!state.isSearchActive &&
          mockCategories
            .filter((category) => category.products.length > 0)
            .map((category) => (
              <ProductSection
                key={category.id}
                category={category}
                onProductPress={handleProductPress}
                onFavoritePress={handleFavoritePress}
              />
            ))}
      </ScrollView>
    </View>
  );
}
