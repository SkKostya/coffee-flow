import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getResponsiveSpacing,
  getResponsiveTypography,
} from '../../shared/constants/responsiveStyles';
import { useColors, useResponsive } from '../../shared/hooks';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  radius?: number;
  onRadiusChange?: (radius: number) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Поиск кофеен...',
  radius = 1,
  onRadiusChange,
}) => {
  const colors = useColors();
  const { currentBreakpoint } = useResponsive();
  const spacing = getResponsiveSpacing(currentBreakpoint);
  const typography = getResponsiveTypography(currentBreakpoint);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgrounds.card,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
      shadowColor: colors.shadows.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    searchIconText: {
      fontSize: typography.body,
      color: colors.texts.secondary,
    },
    input: {
      flex: 1,
      fontSize: typography.body,
      color: colors.texts.primary,
      paddingVertical: spacing.xs,
    },
    radiusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: spacing.sm,
      paddingLeft: spacing.sm,
      borderLeftWidth: 1,
      borderLeftColor: colors.borders.subtle,
    },
    radiusButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 12,
      backgroundColor: colors.primary.main,
      marginLeft: spacing.xs,
    },
    radiusButtonText: {
      fontSize: typography.small,
      color: colors.primary.contrast,
      fontWeight: '600',
    },
    radiusText: {
      fontSize: typography.small,
      color: colors.texts.secondary,
    },
  });

  const handleRadiusPress = () => {
    if (onRadiusChange) {
      // Циклически переключаем радиус: 1км -> 3км -> 5км -> 1км
      const nextRadius = radius === 1 ? 3 : radius === 3 ? 5 : 1;
      onRadiusChange(nextRadius);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <Text style={styles.searchIconText}>🔍</Text>
      </View>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.texts.secondary}
      />

      {onRadiusChange && (
        <View style={styles.radiusContainer}>
          <Text style={styles.radiusText}>В радиусе:</Text>
          <TouchableOpacity
            style={styles.radiusButton}
            onPress={handleRadiusPress}
          >
            <Text style={styles.radiusButtonText}>{radius} км</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
