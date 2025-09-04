import { Ionicons } from '@expo/vector-icons';
import { Text } from '@rneui/themed';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DeleteOrderModal } from '../src/favorites';
import type { RepeatOrder, RepeatOrderItem } from '../src/shared';
import { RepeatOrderCard, useColors } from '../src/shared';

// Пример данных для демонстрации
const exampleRepeatOrder: RepeatOrder = {
  id: 'repeat-1-1234567890',
  items: [
    {
      id: '1',
      name: 'Капучино',
      basePrice: 990,
      image: 'https://example.com/cappuccino1.jpg',
      size: 'М - 400 мл',
      quantity: 2,
      customizations: [
        {
          id: 'caramel-syrup',
          name: 'Сироп Карамель',
          type: 'add',
          price: 100,
          isSelected: true,
        },
        {
          id: 'ice',
          name: 'Лёд',
          type: 'remove',
          price: 0,
          isSelected: false,
        },
      ],
      totalPrice: 1090, // 990 + 100 за сироп
    },
    {
      id: '2',
      name: 'Капучино',
      basePrice: 990,
      image: 'https://example.com/cappuccino2.jpg',
      size: 'М - 400 мл',
      quantity: 2,
      customizations: [],
      totalPrice: 990,
    },
  ],
  coffeeShopId: '1',
  coffeeShopName: 'Coffee BOOM',
  totalAmount: 4160, // (1090 * 2) + (990 * 2)
  originalOrderId: '1',
};

export default function RepeatOrderPage() {
  const colors = useColors();
  const [items, setItems] = useState<RepeatOrderItem[]>(
    exampleRepeatOrder.items
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const toggleCustomization = useCallback(
    (itemId: string, customizationId: string) => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            const updatedCustomizations = item.customizations.map(
              (customization) =>
                customization.id === customizationId
                  ? { ...customization, isSelected: !customization.isSelected }
                  : customization
            );

            // Пересчитываем общую цену товара
            const basePrice = item.basePrice;
            const customizationPrice = updatedCustomizations
              .filter((c) => c.isSelected)
              .reduce((sum, c) => sum + c.price, 0);
            const totalPrice = basePrice + customizationPrice;

            return {
              ...item,
              customizations: updatedCustomizations,
              totalPrice,
            };
          }
          return item;
        })
      );
    },
    []
  );

  const calculateTotalAmount = useCallback(() => {
    return items.reduce(
      (total, item) => total + item.totalPrice * item.quantity,
      0
    );
  }, [items]);

  const handleConfirmOrder = useCallback(() => {
    const updatedOrder: RepeatOrder = {
      ...exampleRepeatOrder,
      items,
      totalAmount: calculateTotalAmount(),
    };
    console.log('Заказ подтвержден:', updatedOrder);
    // Здесь должна быть логика подтверждения заказа
    // Например, навигация к корзине или экрану оплаты
    router.push('/cart');
  }, [items, calculateTotalAmount]);

  const handleCancel = useCallback(() => {
    console.log('Отмена заказа');
    router.back();
  }, []);

  const handleDeleteFavorite = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    console.log('Удаление из избранного подтверждено');
    // Здесь должна быть логика удаления заказа из избранного
    setShowDeleteModal(false);
    router.back();
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('ru-RU')} 〒`;
  };

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
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
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
            {exampleRepeatOrder.coffeeShopName}
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
        {items.map((item) => (
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
            {formatPrice(calculateTotalAmount())}
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
  backButton: {
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
});
