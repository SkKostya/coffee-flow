export interface CoffeeShop {
  id: string;
  name: string;
  rating: number;
  status: 'open' | 'closed' | 'closing_soon';
  address: string;
  distance: number; // в метрах
  image: string;
  workingHours?: {
    open: string;
    close: string;
  };
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface SearchFilters {
  radius: number; // в км
  isOpen?: boolean;
  minRating?: number;
}

export type ViewMode = 'list' | 'map';
