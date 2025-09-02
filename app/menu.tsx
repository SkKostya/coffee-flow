// app/menu.tsx
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

const categories = ['Кофе', 'Чай', 'Десерты'];

const products = [
  {
    id: '1',
    name: 'Капучино',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1604909052743-92f47e4c4f18',
  },
  {
    id: '2',
    name: 'Латте',
    price: 1300,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772',
  },
  {
    id: '3',
    name: 'Чизкейк',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1605478035780-05a4db4df7ac',
  },
];

export default function MenuScreen({ navigation }: any) {
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.backgrounds.primary,
    },
    categories: { marginBottom: 20 },
    categoryButton: {
      backgroundColor: colors.backgrounds.input,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
    },
    categoryText: { fontSize: 16, color: colors.texts.primary },
    products: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    card: {
      width: '48%',
      backgroundColor: colors.backgrounds.card,
      borderRadius: 12,
      padding: 10,
      marginBottom: 15,
      alignItems: 'center',
      shadowColor: colors.shadows.medium,
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    image: { width: '100%', height: 120, borderRadius: 8, marginBottom: 10 },
    productName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.texts.primary,
    },
    price: { fontSize: 14, color: colors.primary.main, marginTop: 4 },
  });

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Меню' }} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
      >
        {categories.map((cat) => (
          <TouchableOpacity key={cat} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.products}>
        {products.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.card}
            onPress={() => router.navigate('/cart')}
          >
            <Image source={{ uri: p.image }} style={styles.image} />
            <Text style={styles.productName}>{p.name}</Text>
            <Text style={styles.price}>{p.price} ₸</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
