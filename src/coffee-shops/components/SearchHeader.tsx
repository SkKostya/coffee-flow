import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useColors } from '../../shared';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  onBackPress?: () => void;
  placeholder?: string;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onBackPress,
  placeholder = 'Поиск',
}) => {
  const colors = useColors();
  const clearButtonOpacity = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);

  // Анимация кнопки очистки
  useEffect(() => {
    Animated.timing(clearButtonOpacity, {
      toValue: searchQuery.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [searchQuery.length, clearButtonOpacity]);

  // Автофокус при открытии поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const containerStyle: ViewStyle = {
    backgroundColor: colors.backgrounds.primary,
  };

  const searchContainerStyle: ViewStyle = {
    backgroundColor: colors.backgrounds.neutral,
    borderColor: colors.borders.subtle,
  };

  const searchInputStyle = {
    color: colors.texts.primary,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.headerContent}>
        {/* Кнопка назад */}
        {onBackPress && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={colors.texts.primary}
            />
          </TouchableOpacity>
        )}

        {/* Поисковая строка */}
        <View style={[styles.searchContainer, searchContainerStyle]}>
          <Ionicons
            name="search"
            size={20}
            color={colors.texts.secondary}
            style={styles.searchIcon}
          />

          <TextInput
            ref={searchInputRef}
            style={[styles.searchInput, searchInputStyle]}
            placeholder={placeholder}
            placeholderTextColor={colors.texts.secondary}
            value={searchQuery}
            onChangeText={onSearchChange}
            autoFocus={false}
            returnKeyType="search"
            clearButtonMode="never"
          />

          <Animated.View
            style={[
              styles.clearButtonContainer,
              { opacity: clearButtonOpacity },
            ]}
          >
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClearSearch}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.texts.secondary}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50, // для статус бара
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  clearButtonContainer: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchHeader;
