// app/orders.tsx
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '../../src/shared/hooks/useColors';

const orders = [
  {
    id: '101',
    items: ['Капучино', 'Чизкейк'],
    total: 3200,
    status: 'Доставлено',
  },
  {
    id: '102',
    items: ['Латте'],
    total: 1300,
    status: 'В обработке',
  },
];

export default function OrdersScreen() {
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.backgrounds.primary,
    },
    card: {
      backgroundColor: colors.backgrounds.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadows.medium,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    orderId: { fontSize: 16, fontWeight: '600', color: colors.texts.primary },
    status: { fontSize: 14, color: colors.primary.main },
    items: { fontSize: 14, color: colors.texts.secondary },
    total: {
      fontSize: 15,
      fontWeight: '700',
      marginTop: 6,
      color: colors.texts.primary,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {orders.map((order) => (
        <TouchableOpacity key={order.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.orderId}>Заказ #{order.id}</Text>
            <Text style={styles.status}>{order.status}</Text>
          </View>
          <Text style={styles.items}>{order.items.join(', ')}</Text>
          <Text style={styles.total}>Итого: {order.total} ₸</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
