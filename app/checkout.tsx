// app/checkout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Button, Text } from '@rneui/themed';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { formatPrice } from '../src/cart/utils/cartUtils';
import {
  CheckoutOrderCard,
  PaymentMethodModal,
  useColors,
} from '../src/shared';
import { useCart, usePaymentMethods } from '../src/store';
import type { PaymentMethod } from '../src/types/payment-methods';

export default function CheckoutScreen() {
  const colors = useColors();

  // Redux hooks
  const {
    cart,
    items,
    partner,
    totalAmount,
    totalItems,
    isLoading: cartLoading,
    error: cartError,
    isEmpty,
    isReadyForCheckout,
  } = useCart();

  const {
    methods: paymentMethods,
    defaultMethod,
    loadPaymentMethods,
    loadingStates,
  } = usePaymentMethods();

  // Local state
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  // Load payment methods on mount
  useEffect(() => {
    loadPaymentMethods();
  }, [loadPaymentMethods]);

  // Set default payment method
  useEffect(() => {
    if (defaultMethod && !selectedPaymentMethod) {
      setSelectedPaymentMethod(defaultMethod);
    }
  }, [defaultMethod, selectedPaymentMethod]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    coffeeShopSection: {
      backgroundColor: colors.backgrounds.neutral,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    coffeeShopInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    coffeeShopLogo: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    coffeeShopDetails: {
      flex: 1,
    },
    coffeeShopName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.texts.primary,
      marginBottom: 2,
    },
    coffeeShopAddress: {
      fontSize: 14,
      color: colors.texts.secondary,
    },
    ordersSection: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.texts.primary,
      marginBottom: 12,
    },
    paymentSection: {
      backgroundColor: colors.backgrounds.neutral,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    paymentMethod: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    paymentMethodLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.texts.primary,
    },
    paymentMethodValue: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    paymentMethodText: {
      fontSize: 14,
      color: colors.texts.secondary,
      marginRight: 8,
    },
    totalSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.texts.primary,
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.texts.primary,
    },
    payButton: {
      backgroundColor: colors.primary.main,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 20,
    },
    payButtonText: {
      color: colors.texts.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    payButtonDisabled: {
      backgroundColor: colors.texts.disabled,
      opacity: 0.6,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.texts.primary,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyMessage: {
      fontSize: 16,
      color: colors.texts.secondary,
      textAlign: 'center',
      marginBottom: 24,
    },
  });

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handlePaymentPress = () => {
    if (!selectedPaymentMethod) {
      setIsPaymentModalVisible(true);
      return;
    }
    // Navigate to payment method selection
    setIsPaymentModalVisible(true);
  };

  const handleConfirmOrder = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Ошибка', 'Выберите способ оплаты');
      return;
    }

    try {
      // Here you would process the payment
      Alert.alert(
        'Заказ подтвержден',
        `Заказ на сумму ${formatPrice(totalAmount)} успешно оформлен`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/orders'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось оформить заказ');
    }
  };

  const getPaymentMethodDisplayName = (method: PaymentMethod | null) => {
    if (!method) return 'Выберите способ оплаты';

    switch (method.type) {
      case 'kaspi':
        return 'Kaspi';
      case 'card':
        return `Карта **** ${method.cardNumber?.slice(-4) || ''}`;
      case 'cash':
        return 'Наличные';
      default:
        return method.name || 'Неизвестный способ';
    }
  };

  if (isEmpty) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Оплата' }} />
        <View style={styles.emptyContainer}>
          <Ionicons
            name="cart-outline"
            size={64}
            color={colors.texts.disabled}
          />
          <Text style={styles.emptyTitle}>Корзина пуста</Text>
          <Text style={styles.emptyMessage}>
            Добавьте товары из меню кофейни
          </Text>
          <Button title="Назад" onPress={() => router.back()} color="primary" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Оплата' }} />

      <ScrollView style={styles.content}>
        {/* Информация о кофейне */}
        {partner && (
          <View style={styles.coffeeShopSection}>
            <View style={styles.coffeeShopInfo}>
              {partner.logo && (
                <Image
                  source={{ uri: partner.logo }}
                  style={styles.coffeeShopLogo}
                />
              )}
              <View style={styles.coffeeShopDetails}>
                <Text style={styles.coffeeShopName}>{partner.name}</Text>
                <Text style={styles.coffeeShopAddress}>{partner.address}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Товары в заказе */}
        <View style={styles.ordersSection}>
          <Text style={styles.sectionTitle}>Ваш заказ</Text>
          {items.map((item) => (
            <CheckoutOrderCard key={item.id} item={item} />
          ))}
        </View>

        {/* Способ оплаты и итоговая сумма */}
        <View style={styles.paymentSection}>
          <TouchableOpacity
            style={styles.paymentMethod}
            onPress={handlePaymentPress}
          >
            <Text style={styles.paymentMethodLabel}>Способ оплаты</Text>
            <View style={styles.paymentMethodValue}>
              <Text style={styles.paymentMethodText}>
                {getPaymentMethodDisplayName(selectedPaymentMethod)}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={colors.texts.secondary}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Итого</Text>
            <Text style={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Кнопка оплаты */}
      <TouchableOpacity
        style={[
          styles.payButton,
          (!selectedPaymentMethod || !isReadyForCheckout) &&
            styles.payButtonDisabled,
        ]}
        onPress={handleConfirmOrder}
        disabled={!selectedPaymentMethod || !isReadyForCheckout}
      >
        <Text style={styles.payButtonText}>
          {cartLoading ? 'Загрузка...' : `Оплатить ${formatPrice(totalAmount)}`}
        </Text>
      </TouchableOpacity>

      {/* Модальное окно выбора способа оплаты */}
      <PaymentMethodModal
        isVisible={isPaymentModalVisible}
        onClose={() => setIsPaymentModalVisible(false)}
        onSelect={handlePaymentMethodSelect}
        paymentMethods={paymentMethods}
        selectedMethod={selectedPaymentMethod}
      />
    </View>
  );
}
