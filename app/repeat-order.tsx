import { Ionicons } from '@expo/vector-icons';
import { Text } from '@rneui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DeleteOrderModal } from '../src/favorites';
import { RepeatOrderCard, useColors } from '../src/shared';
import { useRepeatOrder } from '../src/store';

export default function RepeatOrderPage() {
  const colors = useColors();
  const { orderId, favoriteOrderId } = useLocalSearchParams<{
    orderId?: string;
    favoriteOrderId?: string;
  }>();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Используем хук для управления состоянием повторного заказа
  const {
    items,
    originalOrder,
    totalAmount,
    isLoading,
    error,
    updateQuantity,
    toggleCustomization,
    removeItem,
    submitOrder,
    deleteFromFavorites,
    clearError,
  } = useRepeatOrder({
    orderId,
    favoriteOrderId,
  });

  const handleConfirmOrder = useCallback(async () => {
    await submitOrder();
  }, [submitOrder]);

  const handleCancel = useCallback(() => {
    console.log('Отмена заказа');
    router.back();
  }, []);

  const handleDeleteFavorite = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    await deleteFromFavorites();
    setShowDeleteModal(false);
  }, [deleteFromFavorites]);

  const handleCloseModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('ru-RU')} 〒`;
  };

  // Показываем загрузку
  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.backgrounds.primary },
        ]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.texts.primary }]}>
            Загрузка заказа...
          </Text>
        </View>
      </View>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.backgrounds.primary },
        ]}
      >
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.error.main} />
          <Text style={[styles.errorTitle, { color: colors.texts.primary }]}>
            Ошибка загрузки
          </Text>
          <Text
            style={[styles.errorMessage, { color: colors.texts.secondary }]}
          >
            {error}
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: colors.primary.main },
            ]}
            onPress={clearError}
          >
            <Text
              style={[styles.retryButtonText, { color: colors.texts.primary }]}
            >
              Попробовать снова
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Показываем пустое состояние
  if (!originalOrder || items.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.backgrounds.primary },
        ]}
      >
        <View style={styles.emptyContainer}>
          <Ionicons
            name="cart-outline"
            size={64}
            color={colors.texts.disabled}
          />
          <Text style={[styles.emptyTitle, { color: colors.texts.primary }]}>
            Заказ не найден
          </Text>
          <Text
            style={[styles.emptyMessage, { color: colors.texts.secondary }]}
          >
            Не удалось загрузить данные заказа
          </Text>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: colors.primary.main },
            ]}
            onPress={handleCancel}
          >
            <Text
              style={[styles.backButtonText, { color: colors.texts.primary }]}
            >
              Назад
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgrounds.primary },
      ]}
    >
      {/* Заголовок с навигацией */}
      <View
        style={[styles.header, { backgroundColor: colors.backgrounds.neutral }]}
      >
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={handleCancel}
        >
          <Ionicons name="arrow-back" size={24} color={colors.texts.primary} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.texts.primary }]}>
            Избранный заказ
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteFavorite}
        >
          <Ionicons
            name="trash-outline"
            size={24}
            color={colors.texts.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Информация о кофейне */}
      <View style={styles.coffeeShopInfo}>
        <View
          style={[
            styles.coffeeShopLogo,
            { backgroundColor: colors.backgrounds.secondary },
          ]}
        >
          <Text style={[styles.logoText, { color: colors.texts.primary }]}>
            Coffee BOOM
          </Text>
        </View>

        <View style={styles.coffeeShopDetails}>
          <Text
            style={[styles.coffeeShopName, { color: colors.texts.primary }]}
          >
            {originalOrder.coffeeShopName}
          </Text>
          <Text
            style={[
              styles.coffeeShopAddress,
              { color: colors.texts.secondary },
            ]}
          >
            ул. Каныша Сатпаева, 30/5 к4
          </Text>
        </View>
      </View>

      {/* Список товаров */}
      <ScrollView
        style={styles.itemsContainer}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item: any) => (
          <RepeatOrderCard
            key={item.id}
            item={item}
            onQuantityChange={updateQuantity}
            onCustomizationToggle={toggleCustomization}
          />
        ))}
      </ScrollView>

      {/* Итоговая сумма и кнопки */}
      <View style={[styles.footer, { borderTopColor: colors.borders.subtle }]}>
        <View style={styles.totalSection}>
          <Text style={[styles.totalLabel, { color: colors.texts.secondary }]}>
            Итого:
          </Text>
          <Text style={[styles.totalAmount, { color: colors.texts.primary }]}>
            {formatPrice(totalAmount)}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.primary.main }]}
            onPress={handleCancel}
          >
            <Text
              style={[styles.cancelButtonText, { color: colors.primary.main }]}
            >
              Отмена
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              { backgroundColor: colors.primary.main },
            ]}
            onPress={handleConfirmOrder}
          >
            <Text
              style={[
                styles.confirmButtonText,
                { color: colors.texts.primary },
              ]}
            >
              Повторить заказ
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Модальное окно удаления */}
      <DeleteOrderModal
        visible={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 42,
    paddingBottom: 18,
    marginBottom: 16,
  },
  backButtonHeader: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  coffeeShopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  coffeeShopLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  coffeeShopDetails: {
    flex: 1,
  },
  coffeeShopName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  coffeeShopAddress: {
    fontSize: 14,
    fontWeight: '400',
  },
  itemsContainer: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Новые стили для состояний
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
