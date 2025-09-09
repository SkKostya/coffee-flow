import { Ionicons } from '@expo/vector-icons';
import { Button, Divider, Icon, SearchBar, Text } from '@rneui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColors } from '../src/shared/hooks/useColors';
import type { City } from '../src/types';
import { KAZAKHSTAN_CITIES } from '../src/types/city';

const CitySelectionScreen: React.FC = () => {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState('');

  // Получаем параметры из навигации
  const params = useLocalSearchParams();
  const selectedCityId = params.selectedCityId as string;
  const returnTo = params.returnTo as string;

  // Фильтрация городов по поисковому запросу
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return KAZAKHSTAN_CITIES;
    }

    const query = searchQuery.toLowerCase();
    return KAZAKHSTAN_CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.nameEn.toLowerCase().includes(query) ||
        city.region.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Обработка выбора города
  const handleCitySelect = useCallback(
    (city: City) => {
      // Передаем выбранный город через параметры навигации
      if (returnTo) {
        router.navigate({
          pathname: returnTo as any,
          params: {
            selectedCityId: city.id,
            selectedCityName: city.name,
          },
        });
      } else {
        // Возвращаемся на предыдущий экран
        router.back();
      }
    },
    [returnTo]
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
  const renderCityItem = useCallback(
    ({ item: city }: { item: City }) => {
      const isSelected = selectedCityId === city.id;

      return (
        <TouchableOpacity
          style={[
            styles.cityItem,
            {
              backgroundColor: colors.backgrounds.elevated,
            },
          ]}
          onPress={() => handleCitySelect(city)}
          activeOpacity={0.7}
        >
          <View style={styles.cityContent}>
            <View style={styles.cityInfo}>
              <Text
                style={[
                  styles.cityName,
                  {
                    color: colors.texts.primary,
                    fontWeight: isSelected ? '600' : '400',
                  },
                ]}
              >
                {city.name}
              </Text>
              <Text
                style={[styles.cityRegion, { color: colors.texts.secondary }]}
              >
                {city.region}
              </Text>
            </View>
            {isSelected && (
              <Icon
                name="checkmark-circle"
                type="ionicon"
                color={colors.primary.main}
                size={24}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [selectedCityId, colors, handleCitySelect]
  );

  // Рендер разделителя
  const renderSeparator = useCallback(
    () => (
      <Divider
        style={[styles.separator, { backgroundColor: colors.borders.primary }]}
      />
    ),
    [colors.borders.primary]
  );

  // Рендер пустого состояния
  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Icon
          name="search"
          type="ionicon"
          color={colors.texts.secondary}
          size={48}
        />
        <Text style={[styles.emptyTitle, { color: colors.texts.primary }]}>
          Город не найден
        </Text>
        <Text
          style={[styles.emptyDescription, { color: colors.texts.secondary }]}
        >
          Попробуйте изменить поисковый запрос
        </Text>
        <Button
          title="Очистить поиск"
          type="outline"
          color="primary"
          onPress={handleClearSearch}
          buttonStyle={styles.clearButton}
        />
      </View>
    ),
    [colors, handleClearSearch]
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
  cityItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 2,
  },
  cityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    marginBottom: 4,
  },
  cityRegion: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    marginLeft: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  clearButton: {
    paddingHorizontal: 24,
  },
});

export default CitySelectionScreen;
