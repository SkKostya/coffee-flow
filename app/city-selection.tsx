import { Ionicons } from '@expo/vector-icons';
import { SearchBar, Text } from '@rneui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { City } from '../src/cities';
import { CityEmptyState, CityItem, CitySeparator } from '../src/cities';
import { useColors } from '../src/shared/hooks/useColors';
import { useGeneral } from '../src/store/hooks/useGeneral';

const CitySelectionScreen: React.FC = () => {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState('');

  // Redux хук для работы с общими данными
  const { cities, isLoading, error, loadCities, selectCity } = useGeneral();

  // Получаем параметры из навигации
  const params = useLocalSearchParams();
  const selectedCityId = params.selectedCityId as string;
  const returnTo = params.returnTo as string;

  // Загружаем города при монтировании компонента
  useEffect(() => {
    loadCities();
  }, [loadCities]);

  // Поиск происходит локально через filteredCities

  // Фильтрация городов по поисковому запросу
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return cities;
    }

    const query = searchQuery.toLowerCase();
    return cities.filter(
      (city: City) =>
        city.name.toLowerCase().includes(query) ||
        city.nameRu.toLowerCase().includes(query)
    );
  }, [cities, searchQuery]);

  // Обработка выбора города
  const handleCitySelect = useCallback(
    (city: City) => {
      // Сохраняем выбранный город в глобальном состоянии
      selectCity(city);

      // Передаем выбранный город через параметры навигации
      if (returnTo) {
        router.navigate({
          pathname: returnTo as any,
          params: {
            selectedCityId: city.id,
            selectedCityName: city.nameRu || city.name,
          },
        });
      } else {
        // Возвращаемся на предыдущий экран
        router.back();
      }
    },
    [returnTo, selectCity]
  );

  // Обработка поиска
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Очистка поиска
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Обработка возврата
  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  // Рендер элемента города
  const renderCityItem = ({ item: city }: { item: City }) => {
    const isSelected = selectedCityId === city.id;

    return (
      <CityItem
        city={city}
        isSelected={isSelected}
        onPress={handleCitySelect}
      />
    );
  };

  // Рендер разделителя
  const renderSeparator = () => <CitySeparator />;

  // Рендер пустого состояния
  const renderEmptyState = () => (
    <CityEmptyState
      searchQuery={searchQuery}
      error={error}
      onClearSearch={handleClearSearch}
      onRetry={loadCities}
    />
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgrounds.primary },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.backgrounds.primary}
      />

      {/* Заголовок */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.texts.primary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.texts.primary }]}>
          Выберите город
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Поиск */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Поиск"
          value={searchQuery}
          onChangeText={handleSearch}
          onClear={handleClearSearch}
          containerStyle={[
            styles.searchBar,
            { backgroundColor: colors.backgrounds.elevated },
          ]}
          inputContainerStyle={[
            styles.searchInput,
            { backgroundColor: colors.backgrounds.elevated },
          ]}
          inputStyle={[styles.searchInputText, { color: colors.texts.primary }]}
          placeholderTextColor={colors.texts.secondary}
          searchIcon={{
            name: 'search',
            type: 'ionicon',
            color: colors.texts.secondary,
          }}
          clearIcon={{
            name: 'close-circle',
            type: 'ionicon',
            color: colors.texts.secondary,
          }}
          showCancel={false}
          round
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary.main} />
            <Text
              style={[styles.loadingText, { color: colors.texts.secondary }]}
            >
              Загрузка...
            </Text>
          </View>
        )}
      </View>

      {/* Список городов */}
      <FlatList
        data={filteredCities}
        keyExtractor={(item) => item.id}
        renderItem={renderCityItem}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyState}
        style={styles.citiesList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  searchInput: {
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchInputText: {
    fontSize: 16,
  },
  citiesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default CitySelectionScreen;
