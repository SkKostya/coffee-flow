import { router } from 'expo-router';
import React, { useState } from 'react';
import { useStickyCart, useStickyCartToCart } from '../../store';
import { useStickyCartProducts, useToast } from '../hooks';
import CartSuccessModal from './CartSuccessModal';
import StickyCart from './StickyCart';

const StickyCartWrapper: React.FC = () => {
  const { isVisible, isEmpty, clear } = useStickyCart();
  const {
    addStickyCartToCart,
    isLoading,
    error,
    canAddToCart,
    getAddToCartInfo,
  } = useStickyCartToCart();
  const { showError, showSuccess } = useToast();
  const stickyCartProducts = useStickyCartProducts();

  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{
    itemsCount: number;
    totalItems: number;
    failedItems: number;
  } | null>(null);

  const handleAddToCart = async () => {
    try {
      if (!canAddToCart) {
        showError('Нет товаров для добавления в корзину');
        return;
      }

      setIsAdding(true);

      const result = await addStickyCartToCart();

      if (result.success) {
        // Сохраняем данные для модалки
        setSuccessData({
          itemsCount: result.itemsCount,
          totalItems: result.totalItems,
          failedItems: result.failedItems,
        });

        // Показываем модалку успеха
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Failed to add items to cart:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Не удалось добавить товары в корзину';
      showError(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const handleViewCart = () => {
    router.push('/(tabs)/cart');
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
  };

  const handleViewCartFromModal = () => {
    setShowSuccessModal(false);
    setSuccessData(null);
    router.push('/(tabs)/cart');
  };

  const handleClear = () => {
    clear();
  };

  // Не рендерим, если корзина пуста или не видна
  if (!isVisible || isEmpty) {
    return null;
  }

  return (
    <>
      <StickyCart
        onAddToCart={handleAddToCart}
        onViewCart={handleViewCart}
        onClear={handleClear}
        isLoading={isLoading || isAdding}
        error={error}
        products={stickyCartProducts}
      />

      {successData && (
        <CartSuccessModal
          isVisible={showSuccessModal}
          onClose={handleCloseSuccessModal}
          onViewCart={handleViewCartFromModal}
          itemsCount={successData.itemsCount}
          totalItems={successData.totalItems}
          failedItems={successData.failedItems}
        />
      )}
    </>
  );
};

export default StickyCartWrapper;
