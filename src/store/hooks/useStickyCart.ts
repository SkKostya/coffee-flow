import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectStickyCartInfo,
  selectStickyCartIsEmpty,
  selectStickyCartProductPrices,
  selectStickyCartProductQuantities,
  selectStickyCartSelectedProducts,
  selectStickyCartTotalAmount,
  selectStickyCartTotalItems,
  selectStickyCartVisibility,
} from '../selectors/stickyCartSelectors';
import {
  addProductToSticky,
  clearStickyCart,
  decrementProductQuantity,
  hideStickyCart,
  incrementProductQuantity,
  removeProductFromSticky,
  setProductQuantity,
  setStickyCartVisibility,
  showStickyCart,
  toggleProductInSticky,
  toggleStickyCart,
  updateStickyCartTotal,
} from '../slices/stickyCartSlice';

/**
 * Хук для работы со sticky корзиной
 */
export const useStickyCart = () => {
  const dispatch = useAppDispatch();

  const isVisible = useAppSelector(selectStickyCartVisibility);
  const totalAmount = useAppSelector(selectStickyCartTotalAmount);
  const totalItems = useAppSelector(selectStickyCartTotalItems);
  const isEmpty = useAppSelector(selectStickyCartIsEmpty);
  const info = useAppSelector(selectStickyCartInfo);

  // Показать sticky корзину
  const show = useCallback(() => {
    dispatch(showStickyCart());
  }, [dispatch]);

  // Скрыть sticky корзину
  const hide = useCallback(() => {
    dispatch(hideStickyCart());
  }, [dispatch]);

  // Переключить видимость sticky корзины
  const toggle = useCallback(() => {
    dispatch(toggleStickyCart());
  }, [dispatch]);

  // Установить видимость sticky корзины
  const setVisibility = useCallback(
    (visible: boolean) => {
      dispatch(setStickyCartVisibility(visible));
    },
    [dispatch]
  );

  // Добавить продукт в sticky корзину
  const addProduct = useCallback(
    (productId: string) => {
      dispatch(addProductToSticky(productId));
      dispatch(showStickyCart());
    },
    [dispatch]
  );

  // Удалить продукт из sticky корзины
  const removeProduct = useCallback(
    (productId: string) => {
      dispatch(removeProductFromSticky(productId));
    },
    [dispatch]
  );

  // Переключить продукт в sticky корзине
  const toggleProduct = useCallback(
    (productId: string) => {
      dispatch(toggleProductInSticky(productId));
      dispatch(showStickyCart());
    },
    [dispatch]
  );

  // Обновить общую сумму
  const updateTotal = useCallback(
    (amount: number) => {
      dispatch(updateStickyCartTotal(amount));
    },
    [dispatch]
  );

  // Очистить sticky корзину
  const clear = useCallback(() => {
    dispatch(clearStickyCart());
  }, [dispatch]);

  // Получаем список выбранных продуктов и количества
  const selectedProducts = useAppSelector(selectStickyCartSelectedProducts);
  const productQuantities = useAppSelector(selectStickyCartProductQuantities);
  const productPrices = useAppSelector(selectStickyCartProductPrices);

  // Проверить, находится ли продукт в sticky корзине
  const isProductSelected = useCallback(
    (productId: string) => {
      return selectedProducts.includes(productId);
    },
    [selectedProducts]
  );

  // Получить количество продукта
  const getProductQuantity = useCallback(
    (productId: string) => {
      return productQuantities[productId] || 0;
    },
    [productQuantities]
  );

  // Установить количество продукта
  const setQuantity = useCallback(
    (productId: string, quantity: number, price?: number) => {
      dispatch(setProductQuantity({ productId, quantity, price }));
    },
    [dispatch]
  );

  // Увеличить количество продукта
  const incrementQuantity = useCallback(
    (productId: string) => {
      dispatch(incrementProductQuantity(productId));
    },
    [dispatch]
  );

  // Уменьшить количество продукта
  const decrementQuantity = useCallback(
    (productId: string) => {
      dispatch(decrementProductQuantity(productId));
    },
    [dispatch]
  );

  return {
    isVisible,
    totalAmount,
    totalItems,
    isEmpty,
    info,
    selectedProducts,
    productQuantities,
    productPrices,
    show,
    hide,
    toggle,
    setVisibility,
    addProduct,
    removeProduct,
    toggleProduct,
    updateTotal,
    clear,
    isProductSelected,
    getProductQuantity,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
  };
};
