import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';
import { useStickyCart, useStickyCartToCart } from '../../store';
import { useStickyCartContext } from '../contexts/StickyCartContext';
import { useCurrentRoute, useStickyCartProducts, useToast } from '../hooks';
import CartSuccessModal from './CartSuccessModal';
import StickyCart from './StickyCart';

const StickyCartWrapper: React.FC = () => {
  const { isVisible, isEmpty, clear, hide } = useStickyCart();
  const {
    addStickyCartToCart,
    isLoading,
    error,
    canAddToCart,
    getAddToCartInfo,
  } = useStickyCartToCart();
  const { showError, showSuccess } = useToast();
  const stickyCartProducts = useStickyCartProducts();
  const { shouldShowStickyCart, isCompact } = useCurrentRoute();
  const { cartHeight, setCartHeight, setIsVisible } = useStickyCartContext();

  const [isAdding, setIsAdding] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<{
    itemsCount: number;
    totalItems: number;
    failedItems: number;
  } | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

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

        // Показываем модалку успеха сразу после успешного добавления
        setShowSuccessModal(true);
      } else {
        // Если не удалось добавить ни одного товара
        showError('Не удалось добавить товары в корзину');
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

  const handleCartLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setCartHeight(height + 20); // Добавляем небольшой отступ
  };

  // Автоматически скрываем корзину при переходе на скрытые экраны
  useEffect(() => {
    if (!shouldShowStickyCart && isVisible) {
      // Анимация исчезновения
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        hide();
        setIsVisible(false);
      });
    } else if (shouldShowStickyCart && isVisible && !isEmpty) {
      // Анимация появления
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setIsVisible(true);
    }
  }, [shouldShowStickyCart, isVisible, isEmpty, hide, fadeAnim, setIsVisible]);

  // Не рендерим, если корзина пуста, не видна или на скрытом экране
  if (!isVisible || isEmpty || !shouldShowStickyCart) {
    return null;
  }

  return (
    <>
      {/* Отступ для контента, чтобы он не перекрывался корзиной */}
      {isVisible && !isEmpty && shouldShowStickyCart && (
        <View style={{ height: cartHeight }} />
      )}

      <Animated.View style={{ opacity: fadeAnim }} onLayout={handleCartLayout}>
        <StickyCart
          onAddToCart={handleAddToCart}
          onViewCart={handleViewCart}
          onClear={handleClear}
          isLoading={isLoading || isAdding}
          error={error}
          products={stickyCartProducts}
          isCompact={isCompact}
        />
      </Animated.View>

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
