import { useMemo, useState } from 'react';
import { CoffeeShop } from '../../types';

interface UseCoffeeShopsParams {
  initialShops?: CoffeeShop[];
}

interface UseCoffeeShopsReturn {
  coffeeShops: CoffeeShop[];
  filteredCoffeeShops: CoffeeShop[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  isLoading: boolean;
  error: string | null;
}

export const useCoffeeShops = ({
  initialShops = [],
}: UseCoffeeShopsParams = {}): UseCoffeeShopsReturn => {
  const [coffeeShops] = useState<CoffeeShop[]>(initialShops);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchRadius, setSearchRadius] = useState(1);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Фильтрация кофеен по поисковому запросу
  const filteredCoffeeShops = useMemo(() => {
    if (!searchQuery.trim()) {
      return coffeeShops;
    }

    return coffeeShops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [coffeeShops, searchQuery]);

  return {
    coffeeShops,
    filteredCoffeeShops,
    searchQuery,
    setSearchQuery,
    searchRadius,
    setSearchRadius,
    isLoading,
    error,
  };
};

export default useCoffeeShops;
