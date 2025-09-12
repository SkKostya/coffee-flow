import { Category, CategoryApiResponse } from '../types';

// Утилиты для работы с категориями
export const mapCategoryApiResponse = (
  apiCategory: CategoryApiResponse
): Category => ({
  id: apiCategory.id,
  name: apiCategory.name,
  nameRu: apiCategory.nameRu,
  description: apiCategory.description,
  iconUrl: apiCategory.iconUrl,
  sortOrder: apiCategory.sortOrder,
  isActive: apiCategory.isActive,
  createdAt: apiCategory.createdAt,
  updatedAt: apiCategory.updatedAt,
});
