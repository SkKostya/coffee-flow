// Хук для получения данных о продуктах в sticky cart

import { useMemo } from 'react';
import { useAppSelector, useStickyCart } from '../../store';
import { selectProducts } from '../../store/selectors/coffeeShopsSelectors';

interface StickyCartProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  coffeeShopName: string;
}

/**
 * Хук для получения данных о продуктах в sticky cart
 */
export const useStickyCartProducts = (): StickyCartProduct[] => {
  const { selectedProducts } = useStickyCart();
  const allProducts = useAppSelector(selectProducts);

  const stickyCartProducts = useMemo(() => {
    return selectedProducts
      .map((productId: string) => {
        const product = allProducts.find((p) => p.id === productId);
        if (!product) return null;
        console.log(product);

        return {
          id: product.id,
          name: product.nameRu || product.name,
          price: product.price,
          image: product.imageUrl,
          coffeeShopName: product.partner.name,
        };
      })
      .filter(Boolean) as StickyCartProduct[];
  }, [selectedProducts, allProducts]);

  return stickyCartProducts;
};
