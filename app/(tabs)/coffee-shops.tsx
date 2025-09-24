import { darkMapTheme, lightMapTheme } from '@/src/shared/theme/mapThemeColors';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useColors, useMapCenter } from '../../src/shared';
import { useCoffeeShops, useGeneral, useTheme } from '../../src/store';

const CoffeeShops = () => {
  const { isDark } = useTheme();
  const colors = useColors();
  const [query, setQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState('1 км');
  const [isRadiusDropdownVisible, setIsRadiusDropdownVisible] = useState(false);

  // Redux хук для работы с кофейнями
  const {
    filtered: coffeeShops,
    isLoading,
    error,
    loadNearby,
    setSearchQuery,
    setFilters,
    clearError,
  } = useCoffeeShops();

  // Получаем параметры из навигации
  const params = useLocalSearchParams();
  const selectedCityIdFromParams = params.selectedCityId as string;

  // Управление выбором города
  const { selectedCity, selectCity, cities, userLocation } = useGeneral();

  // Управление центром карты
  const {
    mapRegion,
    isRegionReady,
    centerOnUserLocation,
    centerOnCity,
    centerOnRadius,
    hasUserLocation,
    hasSelectedCity,
  } = useMapCenter({
    userLocation,
    selectedCity,
    searchRadius: parseInt(selectedRadius.replace(' км', '')),
    userZoomLevel: 'NEIGHBORHOOD',
    cityZoomLevel: 'CITY',
  });

  // Обновляем выбранный город при получении параметров
  useEffect(() => {
    if (
      selectedCityIdFromParams &&
      selectedCityIdFromParams !== selectedCity?.id &&
      cities.length > 0
    ) {
      const city = cities.find((c: any) => c.id === selectedCityIdFromParams);
      if (city) {
        selectCity(city);
      }
    }
  }, [selectedCityIdFromParams, selectedCity?.id, selectCity, cities]);

  // Загружаем кофейни при изменении города или радиуса
  useEffect(() => {
    if (selectedCity) {
      const radiusKm = parseInt(selectedRadius.replace(' км', ''));
      loadNearby({
        latitude: parseFloat(selectedCity.latitude),
        longitude: parseFloat(selectedCity.longitude),
        radius: radiusKm,
        cityId: selectedCity.id,
      });
    }
  }, [selectedCity, selectedRadius, loadNearby]);

  // Обработка поискового запроса
  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  // Обработка ошибок
  useEffect(() => {
    if (error) {
      console.error('Coffee shops error:', error);
      // Здесь можно показать уведомление об ошибке
    }
  }, [error]);

  const filtered = Array.isArray(coffeeShops) ? coffeeShops : [];

  // Убеждаемся, что у всех элементов есть уникальные ключи
  const filteredWithKeys = filtered.map((shop, index) => ({
    ...shop,
    uniqueKey: shop.id || `shop-${index}`,
  }));

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['10%', '35%', '80%'], []);

  // Обработка выбора города
  const handleCitySelect = () => {
    router.navigate({
      pathname: '/city-selection',
      params: {
        selectedCityId: selectedCity?.id,
        returnTo: '/coffee-shops',
      },
    });
  };

  // Обработка выбора радиуса
  const handleRadiusSelect = () => {
    setIsRadiusDropdownVisible(!isRadiusDropdownVisible);
  };

  // Обработка выбора радиуса из выпадающего списка
  const handleRadiusChange = (radius: string) => {
    setSelectedRadius(radius);
    setIsRadiusDropdownVisible(false);

    // Обновляем фильтры
    const radiusKm = parseInt(radius.replace(' км', ''));
    setFilters({ radius: radiusKm });
  };

  const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      backgroundColor: colors.backgrounds.neutral,
      paddingTop: 50, // Отступ для статус бара
      paddingHorizontal: 16,
      paddingBottom: 16,
      shadowColor: colors.shadows.medium,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 4,
    },
    cityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    locationIcon: {
      width: 20,
      height: 20,
      marginRight: 8,
      tintColor: colors.primary.main,
    },
    cityName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.texts.primary,
      marginRight: 8,
    },
    changeCityButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    changeCityText: {
      fontSize: 14,
      color: colors.colors.neutral[300],
      textDecorationLine: 'underline',
    },
    radiusRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    radiusButtonInHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgrounds.card,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.borders.subtle,
    },
    radiusIcon: {
      width: 16,
      height: 16,
      marginRight: 6,
    },
    radiusText: {
      fontSize: 14,
      color: colors.texts.primary,
      marginRight: 4,
    },
    chevronIcon: {
      width: 12,
      height: 12,
      tintColor: colors.texts.secondary,
    },
    dropdownContainer: {
      position: 'absolute',
      top: 50,
      left: 16,
      right: 16,
      backgroundColor: colors.backgrounds.neutral,
      borderRadius: 12,
      paddingVertical: 8,
      shadowColor: colors.shadows.medium,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 8,
      zIndex: 1001,
    },
    dropdownItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borders.subtle,
    },
    dropdownItemLast: {
      borderBottomWidth: 0,
    },
    dropdownItemText: {
      fontSize: 16,
      color: colors.texts.primary,
    },
    dropdownItemTextSelected: {
      color: colors.primary.main,
      fontWeight: '600',
    },
    mapContainer: {
      flex: 1,
      marginTop: 120, // Отступ для шапки
    },
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
    errorText: {
      fontSize: 14,
      color: colors.colors.error[500],
      textAlign: 'center',
    },
    mapControls: {
      position: 'absolute',
      top: 40,
      right: 20,
      flexDirection: 'column',
      gap: 8,
    },
    mapControlButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.backgrounds.neutral,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadows.medium,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.borders.subtle,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={() => setIsRadiusDropdownVisible(false)}>
      <View style={styles.container}>
        {/* Шапка с городом и радиусом */}
        <View style={styles.header}>
          {/* Строка с городом */}
          <View style={styles.cityRow}>
            <View style={styles.locationIcon}>
              <Ionicons
                name="location-sharp"
                size={20}
                color={colors.primary.main}
              />
            </View>
            <Text style={styles.cityName}>
              {selectedCity?.name || 'Алматы'}
            </Text>
            <TouchableOpacity
              style={styles.changeCityButton}
              onPress={handleCitySelect}
            >
              <Text style={styles.changeCityText}>Изменить город</Text>
            </TouchableOpacity>
          </View>

          {/* Строка с радиусом поиска */}
          <View style={styles.radiusRow}>
            <TouchableOpacity
              style={styles.radiusButtonInHeader}
              onPress={handleRadiusSelect}
            >
              <View style={styles.radiusIcon}>
                <Ionicons
                  name="compass"
                  size={16}
                  color={colors.primary.main}
                />
              </View>
              <Text style={styles.radiusText}>
                В радиусе: до {selectedRadius}
              </Text>
              <View style={styles.chevronIcon}>
                <Text style={{ fontSize: 10, color: colors.texts.secondary }}>
                  {isRadiusDropdownVisible ? '▲' : '▼'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Выпадающий список радиуса */}
          {isRadiusDropdownVisible && (
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.dropdownContainer}>
                {['1 км', '2 км', '3 км', '4 км'].map((radius, index) => (
                  <TouchableOpacity
                    key={radius}
                    style={[
                      styles.dropdownItem,
                      index === 3 && styles.dropdownItemLast,
                    ]}
                    onPress={() => handleRadiusChange(radius)}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedRadius === radius &&
                          styles.dropdownItemTextSelected,
                      ]}
                    >
                      {radius}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>

        {/* Карта */}
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            customMapStyle={isDark ? darkMapTheme : lightMapTheme}
            region={
              mapRegion || {
                latitude: 43.238949,
                longitude: 76.889709,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }
            }
          >
            {filteredWithKeys.map((shop) => (
              <Marker
                key={shop.uniqueKey}
                coordinate={{
                  latitude: Number(shop.latitude),
                  longitude: Number(shop.longitude),
                }}
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

          {/* Кнопки управления картой */}
          <View style={styles.mapControls}>
            {hasUserLocation && (
              <TouchableOpacity
                style={styles.mapControlButton}
                onPress={centerOnUserLocation}
              >
                <Ionicons name="locate" size={20} color={colors.primary.main} />
              </TouchableOpacity>
            )}

            {!!selectedCity && (
              <TouchableOpacity
                style={styles.mapControlButton}
                onPress={centerOnCity}
              >
                <Ionicons
                  name="business"
                  size={20}
                  color={colors.primary.main}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.mapControlButton}
              onPress={() =>
                centerOnRadius(parseInt(selectedRadius.replace(/\D/g, '')))
              }
            >
              <Ionicons name="search" size={20} color={colors.primary.main} />
            </TouchableOpacity>
          </View>
        </View>

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
              {isLoading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={colors.primary.main} />
                  <Text
                    style={{ marginTop: 10, color: colors.texts.secondary }}
                  >
                    Загрузка кофеен...
                  </Text>
                </View>
              ) : error ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={styles.errorText}>Ошибка загрузки: {error}</Text>
                  <TouchableOpacity
                    style={{
                      marginTop: 10,
                      padding: 10,
                      backgroundColor: colors.primary.main,
                      borderRadius: 8,
                    }}
                    onPress={() => clearError()}
                  >
                    <Text style={{ color: colors.texts.primary }}>
                      Повторить
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {filteredWithKeys.map((shop) => (
                    <TouchableOpacity
                      key={shop.uniqueKey}
                      style={styles.card}
                      onPress={() =>
                        router.navigate({
                          pathname: '/coffee-shops/[id]',
                          params: { id: shop.id },
                        })
                      }
                    >
                      <Image
                        source={{
                          uri:
                            shop.logoUrl || 'https://via.placeholder.com/80x80',
                        }}
                        style={styles.image}
                      />
                      <View style={styles.info}>
                        <Text style={styles.name}>{shop.name}</Text>
                        <Text style={styles.address}>{shop.address}</Text>
                        <Text style={styles.rating}>
                          ⭐ {shop.rating} ({shop.reviewCount} отзывов)
                        </Text>
                        <Text
                          style={[
                            styles.rating,
                            { fontSize: 12, marginTop: 2 },
                          ]}
                        >
                          {shop.isOpen ? '🟢 Открыто' : '🔴 Закрыто'} •{' '}
                          {shop.openingHours}
                        </Text>
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
                </>
              )}
            </ScrollView>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CoffeeShops;
