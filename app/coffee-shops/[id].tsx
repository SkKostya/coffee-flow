import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { MenuProduct } from '../../src/coffee-shops';
import {
  calculateSectionOffsets,
  CategoryHeader,
  CoffeeShopHeader,
  createSearchDebounce,
  createSearchState,
  EmptySearchResults,
  getActiveCategoryByScrollPosition,
  ProductSection,
  scrollToCategory,
  SearchHeader,
  SearchResultsGrid,
} from '../../src/coffee-shops';
import type { CategoryTab } from '../../src/coffee-shops/types/categories';
import { useColors } from '../../src/shared';
import { useCoffeeShops, useProducts } from '../../src/store';
import { useGeneral } from '../../src/store/hooks/useGeneral';

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

  // Получаем ID кофейни из параметров
  const { id } = useLocalSearchParams<{ id: string }>();

  // Redux хуки
  const {
    selected: coffeeShop,
    loadById,
    isLoading: isCoffeeShopLoading,
    error: coffeeShopError,
  } = useCoffeeShops();
  const {
    products,
    loadProducts,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts();
  const { activeCategories } = useGeneral();

  // Состояние компонента
  const [state, setState] = useState<CoffeeShopScreenState>({
    searchQuery: '',
    isSearchActive: false,
    activeCategoryId: activeCategories[0]?.id || '',
    categories: activeCategories.map((cat: any) => ({
      id: cat.id,
      name: cat.nameRu,
      isActive: cat.id === (activeCategories[0]?.id || ''),
      isVisible: true, // Все категории видимы по умолчанию
    })),
    filteredProducts: [],
    scrollY: 0,
    sectionOffsets: {},
  });

  // Преобразуем продукты в MenuProduct
  const menuProducts = products.map((product: any) => ({
    id: product.id,
    name: product.name,
    nameRu: product.nameRu,
    description: product.description || '',
    price: product.price,
    image: product.imageUrl || '',
    isAvailable: product.isAvailable,
    coffeeShopId: product.partnerId || '',
    coffeeShopName: coffeeShop?.name || '',
    categoryId: product.categoryId,
    category: product.category || {
      id: product.categoryId,
      name: '',
      nameRu: '',
    },
  }));

  // Дебаунс функция для поиска
  const debouncedSearch = useRef(
    createSearchDebounce((query: string) => {
      const searchState = createSearchState(query, menuProducts);
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

  // Загружаем данные кофейни при монтировании
  useEffect(() => {
    if (id) {
      loadById({ id });
      loadProducts({ id });
    }
  }, [id, loadById, loadProducts]);

  // Обновляем категории при изменении данных
  useEffect(() => {
    if (activeCategories.length > 0) {
      setState((prev) => ({
        ...prev,
        activeCategoryId: activeCategories[0]?.id || '',
        categories: activeCategories.map((cat: any) => ({
          id: cat.id,
          name: cat.nameRu,
          isActive: cat.id === (activeCategories[0]?.id || ''),
          isVisible: true,
        })),
      }));
    }
  }, [activeCategories]);

  // Инициализация смещений секций
  useEffect(() => {
    if (activeCategories.length > 0) {
      const offsets = calculateSectionOffsets(
        activeCategories,
        100, // header height
        60, // category header height
        200 // interior image height
      );

      setState((prev) => ({
        ...prev,
        sectionOffsets: offsets,
      }));
    }
  }, [activeCategories]);

  // Обработчик скролла для автоматического переключения категорий
  const handleScroll = useCallback(
    (event: any) => {
      const scrollY = event.nativeEvent.contentOffset.y;

      setState((prev) => {
        const newActiveCategoryId = getActiveCategoryByScrollPosition(
          scrollY,
          activeCategories,
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
    },
    [activeCategories]
  );

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
          name={coffeeShop?.name || 'Загрузка...'}
          address={coffeeShop?.address || ''}
          logo={coffeeShop?.logoUrl || ''}
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
            source={{
              uri:
                coffeeShop?.bannerUrl || 'https://via.placeholder.com/400x200',
            }}
            style={styles.interiorImage}
            resizeMode="cover"
          />
        )}

        {/* Состояние загрузки */}
        {(isCoffeeShopLoading || isProductsLoading) && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={{ marginTop: 10, color: colors.texts.secondary }}>
              Загрузка данных...
            </Text>
          </View>
        )}

        {/* Состояние ошибки */}
        {(coffeeShopError || productsError) && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text
              style={{ color: colors.colors.error[500], textAlign: 'center' }}
            >
              Ошибка загрузки: {coffeeShopError || productsError}
            </Text>
          </View>
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
          activeCategories
            .map((category: any) => ({
              ...category,
              products: menuProducts.filter(
                (product) => product.categoryId === category.id
              ),
            }))
            .filter((category: any) => category.products.length > 0)
            .map((category: any) => (
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
