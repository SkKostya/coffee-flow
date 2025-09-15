// app/orders.tsx
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '../src/shared/hooks/useColors';
import { useOrders } from '../src/store';
import type { OrderStatus } from '../src/types/orders';

export default function OrdersScreen() {
  const colors = useColors();
  const { ordersForUI, isLoading, error, loadOrders, clearError, repeatOrder } =
    useOrders();

  // Загружаем заказы при монтировании компонента
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleOrderPress = useCallback(
    async (orderId: string) => {
      try {
        // Повторяем заказ через API
        await repeatOrder(orderId);
        // Переходим на страницу повторения заказа
        router.push('/repeat-order');
      } catch (err) {
        console.error('Ошибка повторения заказа:', err);
        // В случае ошибки все равно переходим на страницу
        router.push('/repeat-order');
      }
    },
    [repeatOrder]
  );

  const handleRefresh = useCallback(() => {
    loadOrders();
  }, [loadOrders]);

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('ru-RU')} 〒`;
  };

  const formatDate = (dateString: string): { date: string; time: string } => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { date: dateStr, time: timeStr };
  };

  const getStatusText = (status: OrderStatus): string => {
    const statusMap: Record<OrderStatus, string> = {
      received: 'Получен',
      preparing: 'Готовится',
      ready: 'Готов',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: OrderStatus): string => {
    const colorMap: Record<OrderStatus, string> = {
      received: colors.success.main,
      preparing: colors.primary.main,
      ready: colors.primary.main,
      delivered: colors.success.main,
      cancelled: colors.error.main,
    };
    return colorMap[status] || colors.texts.secondary;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.backgrounds.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgrounds.primary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgrounds.primary,
      padding: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgrounds.primary,
      padding: 20,
    },
    card: {
      backgroundColor: colors.backgrounds.card,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: colors.shadows.medium,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 4,
      overflow: 'hidden',
    },
    // Верхняя секция
    topSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    orderInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    checkIcon: {
      marginRight: 8,
    },
    orderText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.texts.primary,
    },
    orderNumber: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary.main,
      marginLeft: 4,
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.texts.primary,
    },
    currencySymbol: {
      fontSize: 16,
      color: colors.primary.main,
      marginLeft: 2,
    },
    dateTime: {
      fontSize: 14,
      color: colors.texts.secondary,
      textAlign: 'center',
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    divider: {
      height: 1,
      backgroundColor: colors.borders.subtle,
      marginHorizontal: 16,
    },
    // Средняя секция
    middleSection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    coffeeShopLogo: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.backgrounds.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    logoText: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.texts.primary,
      textAlign: 'center',
    },
    coffeeShopInfo: {
      flex: 1,
    },
    coffeeShopName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.texts.primary,
      marginBottom: 4,
    },
    coffeeShopAddress: {
      fontSize: 14,
      color: colors.texts.secondary,
    },
    // Нижняя секция
    bottomSection: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    itemsText: {
      fontSize: 14,
      color: colors.texts.secondary,
      lineHeight: 20,
    },
    // Состояния
    loadingText: {
      fontSize: 16,
      color: colors.texts.secondary,
      marginTop: 12,
    },
    errorText: {
      fontSize: 16,
      color: colors.error.main,
      textAlign: 'center',
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: colors.primary.main,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: {
      color: colors.texts.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    emptyText: {
      fontSize: 16,
      color: colors.texts.secondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.texts.secondary,
      textAlign: 'center',
    },
  });

  // Обработка состояний загрузки
  if (isLoading && ordersForUI.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen
          options={{ headerShown: true, title: 'История заказов' }}
        />
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Загрузка заказов...</Text>
      </View>
    );
  }

  // Обработка ошибок
  if (error && ordersForUI.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen
          options={{ headerShown: true, title: 'История заказов' }}
        />
        <Ionicons name="alert-circle" size={48} color={colors.error.main} />
        <Text style={styles.errorText}>
          {typeof error === 'string' ? error : 'Ошибка загрузки заказов'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Пустое состояние
  if (ordersForUI.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Stack.Screen
          options={{ headerShown: true, title: 'История заказов' }}
        />
        <Ionicons
          name="receipt-outline"
          size={48}
          color={colors.texts.secondary}
        />
        <Text style={styles.emptyText}>У вас пока нет заказов</Text>
        <Text style={styles.emptySubtext}>
          Сделайте первый заказ в любой кофейне
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={handleRefresh}
          colors={[colors.primary.main]}
          tintColor={colors.primary.main}
        />
      }
    >
      <Stack.Screen options={{ headerShown: true, title: 'История заказов' }} />

      {ordersForUI.map((order) => {
        const { date, time } = formatDate(order.createdAt);
        const statusText = getStatusText(order.status);
        const statusColor = getStatusColor(order.status);

        return (
          <TouchableOpacity
            key={order.id}
            style={styles.card}
            onPress={() => handleOrderPress(order.id)}
            activeOpacity={0.7}
          >
            {/* Верхняя секция */}
            <View style={styles.topSection}>
              <View style={styles.orderInfo}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={statusColor}
                  style={styles.checkIcon}
                />
                <Text style={styles.orderText}>Заказ</Text>
                <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.totalAmount}>
                  {formatPrice(order.totalAmount)}
                </Text>
              </View>
            </View>

            <Text style={styles.dateTime}>
              {date} | {time}
            </Text>

            <View style={styles.divider} />

            {/* Средняя секция */}
            <View style={styles.middleSection}>
              <View style={styles.coffeeShopLogo}>
                <Text style={styles.logoText}>
                  {order.partner.logo || order.partner.name}
                </Text>
              </View>
              <View style={styles.coffeeShopInfo}>
                <Text style={styles.coffeeShopName}>{order.partner.name}</Text>
                <Text style={styles.coffeeShopAddress}>
                  {order.partner.address}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Нижняя секция */}
            <View style={styles.bottomSection}>
              <Text style={styles.itemsText}>{order.items.join(', ')}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
