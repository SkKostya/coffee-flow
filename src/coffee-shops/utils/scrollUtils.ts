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
  // Учитываем небольшой отступ для более точного определения
  const threshold = 50; // пикселей от верха экрана
  let activeCategoryId = categories[0]?.id || '';

  // Ищем первую категорию, которая находится в области видимости
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const offset = sectionOffsets[category.id];

    if (offset !== undefined) {
      // Если текущая позиция скролла находится в пределах этой секции
      if (scrollY + threshold >= offset) {
        activeCategoryId = category.id;
      } else {
        // Если мы прошли все секции, которые находятся в области видимости
        break;
      }
    }
  }

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
    // Используем функцию для точного расчета высоты секции
    const sectionHeight = calculateSectionHeight(category.products.length);
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
    // Добавляем небольшой отступ сверху для лучшего позиционирования
    // Это обеспечит, что заголовок категории будет виден полностью
    const adjustedOffset = Math.max(0, offset - 20);

    scrollViewRef.current.scrollTo({
      y: adjustedOffset,
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

/**
 * Вычисляет точную высоту секции на основе количества продуктов
 */
export const calculateSectionHeight = (productsCount: number): number => {
  const sectionTitleHeight = 30; // fontSize + marginBottom
  const productRowHeight = 140; // высота карточки продукта
  const rowSpacing = 12; // отступ между рядами
  const sectionBottomMargin = 24; // отступ снизу секции

  const rowsCount = Math.ceil(productsCount / 2);

  return (
    sectionTitleHeight +
    rowsCount * productRowHeight +
    (rowsCount - 1) * rowSpacing +
    sectionBottomMargin
  );
};
