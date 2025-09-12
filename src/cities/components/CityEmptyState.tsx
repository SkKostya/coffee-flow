import { Button, Icon, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useColors } from '../../shared/hooks/useColors';

interface CityEmptyStateProps {
  searchQuery: string;
  error: string | null;
  onClearSearch: () => void;
  onRetry: () => void;
}

const CityEmptyState: React.FC<CityEmptyStateProps> = React.memo(
  ({ searchQuery, error, onClearSearch, onRetry }) => {
    const colors = useColors();

    return (
      <View style={styles.emptyState}>
        <Icon
          name="search"
          type="ionicon"
          color={colors.texts.secondary}
          size={48}
        />
        <Text style={[styles.emptyTitle, { color: colors.texts.primary }]}>
          {searchQuery.trim() ? 'Город не найден' : 'Нет доступных городов'}
        </Text>
        <Text
          style={[styles.emptyDescription, { color: colors.texts.secondary }]}
        >
          {searchQuery.trim()
            ? 'Попробуйте изменить поисковый запрос'
            : 'Проверьте подключение к интернету'}
        </Text>
        {searchQuery.trim() && (
          <Button
            title="Очистить поиск"
            type="outline"
            color="primary"
            onPress={onClearSearch}
            buttonStyle={styles.clearButton}
          />
        )}
        {error && (
          <Button
            title="Повторить"
            color="primary"
            onPress={onRetry}
            buttonStyle={styles.retryButton}
          />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
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
  retryButton: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
});

CityEmptyState.displayName = 'CityEmptyState';

export default CityEmptyState;
