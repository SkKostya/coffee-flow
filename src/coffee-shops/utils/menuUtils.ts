import type { MenuProduct, ProductCategory, SearchState } from '../types';

/**
 * Группирует продукты по категориям
 */
export const groupProductsByCategory = (
  products: MenuProduct[]
): ProductCategory[] => {
  const categoryMap = new Map<string, MenuProduct[]>();

  // Группируем продукты по categoryId
  products.forEach((product) => {
    if (!categoryMap.has(product.categoryId)) {
      categoryMap.set(product.categoryId, []);
    }
    categoryMap.get(product.categoryId)!.push(product);
  });

  // Преобразуем в массив категорий
  const categories: ProductCategory[] = [];
  categoryMap.forEach((products, categoryId) => {
    // Получаем название категории из первого продукта
    const categoryName = getCategoryName(categoryId);
    categories.push({
      id: categoryId,
      name: categoryName,
      products,
      order: getCategoryOrder(categoryId),
    });
  });

  // Сортируем по порядку
  return categories.sort((a, b) => a.order - b.order);
};

/**
 * Фильтрует продукты по поисковому запросу с улучшенной логикой
 */
export const filterProductsBySearch = (
  products: MenuProduct[],
  searchQuery: string
): MenuProduct[] => {
  if (!searchQuery.trim()) {
    return products;
  }

  const query = searchQuery.toLowerCase().trim();
  const queryWords = query.split(' ').filter((word) => word.length > 0);

  return products.filter((product) => {
    const searchableText = [
      product.name,
      product.description || '',
      product.category,
      product.coffeeShopName,
    ]
      .join(' ')
      .toLowerCase();

    // Точное совпадение
    if (searchableText.includes(query)) {
      return true;
    }

    // Совпадение по всем словам
    return queryWords.every((word) => searchableText.includes(word));
  });
};

/**
 * Сортирует результаты поиска по релевантности
 */
export const sortSearchResults = (
  products: MenuProduct[],
  searchQuery: string
): MenuProduct[] => {
  if (!searchQuery.trim()) {
    return products;
  }

  const query = searchQuery.toLowerCase().trim();

  return products.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    // Приоритет: точное совпадение в названии
    const aExactMatch = aName === query;
    const bExactMatch = bName === query;
    if (aExactMatch && !bExactMatch) return -1;
    if (!aExactMatch && bExactMatch) return 1;

    // Приоритет: начинается с поискового запроса
    const aStartsWith = aName.startsWith(query);
    const bStartsWith = bName.startsWith(query);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    // Приоритет: содержит поисковый запрос
    const aContains = aName.includes(query);
    const bContains = bName.includes(query);
    if (aContains && !bContains) return -1;
    if (!aContains && bContains) return 1;

    // Сортировка по алфавиту
    return aName.localeCompare(bName);
  });
};

/**
 * Создает состояние поиска с сортировкой результатов
 */
export const createSearchState = (
  query: string,
  allProducts: MenuProduct[]
): SearchState => {
  const isActive = query.trim().length > 0;
  let filteredProducts: MenuProduct[] = [];

  if (isActive) {
    filteredProducts = filterProductsBySearch(allProducts, query);
    filteredProducts = sortSearchResults(filteredProducts, query);
  }

  return {
    query: query.trim(),
    isActive,
    filteredProducts,
  };
};

/**
 * Получает название категории по ID
 */
const getCategoryName = (categoryId: string): string => {
  const categoryNames: Record<string, string> = {
    'tea-coffee': 'Чай, кофе',
    'coffee-cocktails': 'Коктейли с кофе',
    'milk-coffee': 'Молочные кофе',
    desserts: 'Десерты',
    breakfast: 'Завтраки',
  };

  return categoryNames[categoryId] || categoryId;
};

/**
 * Получает порядок сортировки категории
 */
const getCategoryOrder = (categoryId: string): number => {
  const categoryOrders: Record<string, number> = {
    'tea-coffee': 1,
    'coffee-cocktails': 2,
    'milk-coffee': 3,
    desserts: 4,
    breakfast: 5,
  };

  return categoryOrders[categoryId] || 999;
};

/**
 * Проверяет, есть ли доступные продукты в категории
 */
export const hasAvailableProducts = (category: ProductCategory): boolean => {
  return category.products.some((product) => product.isAvailable);
};

/**
 * Получает количество доступных продуктов в категории
 */
export const getAvailableProductsCount = (
  category: ProductCategory
): number => {
  return category.products.filter((product) => product.isAvailable).length;
};

/**
 * Создает дебаунс функцию для поиска
 */
export const createSearchDebounce = (
  callback: (query: string) => void,
  delay: number = 300
): ((query: string) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (query: string) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(query), delay);
  };
};

/**
 * Получает подсказки для поиска на основе введенного текста
 */
export const getSearchSuggestions = (
  products: MenuProduct[],
  query: string,
  maxSuggestions: number = 5
): string[] => {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    const category = product.category.toLowerCase();

    // Добавляем названия продуктов, которые начинаются с запроса
    if (name.startsWith(queryLower)) {
      suggestions.add(product.name);
    }

    // Добавляем категории, которые содержат запрос
    if (category.includes(queryLower)) {
      suggestions.add(product.category);
    }
  });

  return Array.from(suggestions).slice(0, maxSuggestions);
};
