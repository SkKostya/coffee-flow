// app/cart.tsx
import { router, Stack } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '../src/shared/hooks/useColors';

const cartItems = [
  {
    id: '1',
    name: 'Капучино',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1604909052743-92f47e4c4f18',
    qty: 1,
  },
  {
    id: '2',
    name: 'Чизкейк',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1605478035780-05a4db4df7ac',
    qty: 2,
  },
];

export default function CartScreen({ navigation }: any) {
  const colors = useColors();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.backgrounds.primary,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: colors.backgrounds.card,
      borderRadius: 12,
      padding: 10,
      marginBottom: 12,
      shadowColor: colors.shadows.medium,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    image: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
    info: { flex: 1, justifyContent: 'center' },
    name: { fontSize: 16, fontWeight: '600', color: colors.texts.primary },
    price: { fontSize: 14, color: colors.primary.main, marginTop: 2 },
    qty: { fontSize: 14, color: colors.texts.secondary, marginTop: 4 },
    footer: { marginTop: 20, alignItems: 'center' },
    total: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
      color: colors.texts.primary,
    },
    button: {
      backgroundColor: colors.primary.main,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: { color: colors.colors.white, fontSize: 16, fontWeight: '600' },
  });

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Корзина' }} />

      {cartItems.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price} ₸</Text>
            <Text style={styles.qty}>Количество: {item.qty}</Text>
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.total}>Итого: {total} ₸</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.navigate('/checkout')}
        >
          <Text style={styles.buttonText}>Перейти к оплате</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
