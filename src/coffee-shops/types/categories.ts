export interface CategoryTab {
  id: string;
  name: string;
  isActive: boolean;
  isVisible: boolean;
}

export interface CategoryScrollState {
  activeCategoryId: string;
  categories: CategoryTab[];
}
