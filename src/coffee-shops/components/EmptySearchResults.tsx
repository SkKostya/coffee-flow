import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useColors } from '../../shared';

interface EmptySearchResultsProps {
  searchQuery: string;
  onClearSearch: () => void;
}

const EmptySearchResults: React.FC<EmptySearchResultsProps> = ({
  searchQuery,
  onClearSearch,
}) => {
  const colors = useColors();

  const containerStyle: ViewStyle = {
    backgroundColor: colors.backgrounds.neutral,
  };

  const textStyle = {
    color: colors.texts.secondary,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons
        name="search-outline"
        size={48}
        color={colors.texts.secondary}
        style={styles.icon}
      />

      <Text style={[styles.title, { color: colors.texts.primary }]}>
        Ничего не найдено
      </Text>

      <Text style={[styles.subtitle, textStyle]}>
        По запросу "{searchQuery}" ничего не найдено
      </Text>

      <Text style={[styles.suggestion, textStyle]}>
        Попробуйте изменить поисковый запрос или очистить поиск
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    marginHorizontal: 16,
    marginVertical: 24,
    borderRadius: 16,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  suggestion: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default EmptySearchResults;
