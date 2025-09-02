import { darkMapTheme, lightMapTheme } from '@/src/shared/theme/mapThemeColors';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '../../src/shared/contexts/ThemeContext';
import { useColors } from '../../src/shared/hooks/useColors';

const coffeeShops = [
  {
    id: 'c1',
    name: 'Кофейня Arabica',
    address: 'ул. Абая, 10',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    coords: { latitude: 43.238949, longitude: 76.889709 },
  },
  {
    id: 'c2',
    name: 'Caffeine Spot',
    address: 'пр. Назарбаева, 25',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814',
    coords: { latitude: 43.242949, longitude: 76.895709 },
  },
  {
    id: 'c3',
    name: 'Latte Time',
    address: 'ул. Толе би, 55',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096',
    coords: { latitude: 43.240949, longitude: 76.892709 },
  },
];

export default function HomeScreen() {
  const { isDark } = useTheme();
  const colors = useColors();
  const [query, setQuery] = useState('');
  const filtered = coffeeShops.filter((shop) =>
    shop.name.toLowerCase().includes(query.toLowerCase())
  );

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['10%', '35%', '80%'], []);

  const styles = StyleSheet.create({
    container: { flex: 1 },
    sheetContent: {
      flex: 1,
      paddingHorizontal: 16,
    },
    handle: {
      width: 50,
      height: 5,
      backgroundColor: colors.colors.neutral[300],
      borderRadius: 3,
      alignSelf: 'center',
      marginVertical: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 10,
      color: colors.primary.main,
    },
    search: {
      marginBottom: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.borders.subtle,
      borderRadius: 8,
      fontSize: 16,
      backgroundColor: colors.backgrounds.input,
      color: colors.texts.primary,
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
    <View style={styles.container}>
      {/* Карта занимает фон */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        customMapStyle={isDark ? darkMapTheme : lightMapTheme}
        initialRegion={{
          latitude: 43.238949,
          longitude: 76.889709,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {filtered.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={shop.coords}
            title={shop.name}
            description={shop.address}
            onPress={() =>
              router.navigate({
                pathname: '/coffee-shops/[id]',
                params: { id: shop.id },
              })
            }
          />
        ))}
      </MapView>

      {/* Список в bottom sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: colors.borders.secondary }}
        backgroundStyle={{ backgroundColor: colors.backgrounds.primary }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={styles.title}>Кофейни рядом</Text>
          <TextInput
            style={styles.search}
            placeholder="Поиск кофейни"
            placeholderTextColor={colors.texts.secondary}
            value={query}
            onChangeText={setQuery}
          />

          <ScrollView>
            {filtered.map((shop) => (
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
            {filtered.length === 0 && (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                  color: colors.texts.secondary,
                }}
              >
                Ничего не найдено
              </Text>
            )}
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
