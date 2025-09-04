export interface CategoryTab {
  id: string;
  name: string;
  isActive: boolean;
}

export interface CategoryScrollState {
  activeCategoryId: string;
  categories: CategoryTab[];
}
