// Типы для работы с общими данными в модуле general

export interface Category {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  iconUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Тип для API ответа категории
export interface CategoryApiResponse {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  iconUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Redux состояние для общих данных
export interface GeneralState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

// Действия для общих данных
export interface GeneralActions {
  setCategories: (categories: Category[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

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
