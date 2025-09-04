import type { ProductCategory } from '../types';

/**
 * Определяет, какая категория должна быть активной на основе позиции скролла
 */
export const getActiveCategoryByScrollPosition = (
  scrollY: number,
  categories: ProductCategory[],
  sectionOffsets: Record<string, number>
): string => {
  // Находим категорию, которая ближе всего к верху экрана
  let activeCategoryId = categories[0]?.id || '';
  let minDistance = Infinity;

  categories.forEach((category) => {
    const offset = sectionOffsets[category.id];
    if (offset !== undefined) {
      const distance = Math.abs(scrollY - offset);
      if (distance < minDistance) {
        minDistance = distance;
        activeCategoryId = category.id;
      }
    }
  });

  return activeCategoryId;
};

/**
 * Вычисляет смещения секций относительно начала контента
 */
export const calculateSectionOffsets = (
  categories: ProductCategory[],
  headerHeight: number = 0,
  categoryHeaderHeight: number = 0,
  interiorImageHeight: number = 0
): Record<string, number> => {
  const offsets: Record<string, number> = {};
  let currentOffset = headerHeight + categoryHeaderHeight + interiorImageHeight;

  categories.forEach((category) => {
    offsets[category.id] = currentOffset;
    // Добавляем высоту секции (заголовок + продукты)
    const sectionHeight =
      60 + Math.ceil(category.products.length / 2) * 140 + 24;
    currentOffset += sectionHeight;
  });

  return offsets;
};

/**
 * Прокручивает к определенной категории
 */
export const scrollToCategory = (
  categoryId: string,
  sectionOffsets: Record<string, number>,
  scrollViewRef: React.RefObject<any>
): void => {
  const offset = sectionOffsets[categoryId];
  if (offset !== undefined && scrollViewRef.current) {
    scrollViewRef.current.scrollTo({
      y: offset,
      animated: true,
    });
  }
};

/**
 * Проверяет, видна ли секция на экране
 */
export const isSectionVisible = (
  sectionOffset: number,
  scrollY: number,
  screenHeight: number
): boolean => {
  const sectionTop = sectionOffset;
  const sectionBottom = sectionOffset + 200; // Примерная высота секции
  const screenTop = scrollY;
  const screenBottom = scrollY + screenHeight;

  return (
    (sectionTop >= screenTop && sectionTop <= screenBottom) ||
    (sectionBottom >= screenTop && sectionBottom <= screenBottom) ||
    (sectionTop <= screenTop && sectionBottom >= screenBottom)
  );
};
