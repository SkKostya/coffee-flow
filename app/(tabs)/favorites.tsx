// app/favorites.tsx
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '../../src/shared/hooks/useColors';

const favorites = [
  {
    id: 'c1',
    name: 'Кофейня Arabica',
    address: 'ул. Абая, 10',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
  },
  {
    id: 'c2',
    name: 'Caffeine Spot',
    address: 'пр. Назарбаева, 25',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814',
  },
];

export default function FavoritesScreen({ navigation }: any) {
  const colors = useColors();

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
    address: { fontSize: 14, color: colors.texts.secondary, marginTop: 2 },
    rating: { fontSize: 14, color: colors.primary.main, marginTop: 4 },
  });

  return (
    <ScrollView style={styles.container}>
      {favorites.map((shop) => (
        <TouchableOpacity
          key={shop.id}
          style={styles.card}
          onPress={() =>
            router.navigate({
              pathname: '/coffee-shops/[id]',
              params: { id: shop.id },
            })
          }
        >
          <Image source={{ uri: shop.image }} style={styles.image} />
          <View style={styles.info}>
            <Text style={styles.name}>{shop.name}</Text>
            <Text style={styles.address}>{shop.address}</Text>
            <Text style={styles.rating}>⭐ {shop.rating}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
