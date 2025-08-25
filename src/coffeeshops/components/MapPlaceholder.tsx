import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  getResponsiveSpacing,
  getResponsiveTypography,
} from '../../shared/constants/responsiveStyles';
import { useColors, useResponsive } from '../../shared/hooks';

interface MapPlaceholderProps {
  onToggleView?: () => void;
  showCoffeeShops?: boolean;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  onToggleView,
  showCoffeeShops = true,
}) => {
  const colors = useColors();
  const { currentBreakpoint } = useResponsive();
  const spacing = getResponsiveSpacing(currentBreakpoint);
  const typography = getResponsiveTypography(currentBreakpoint);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgrounds.secondary,
      position: 'relative',
    },
    mapArea: {
      flex: 1,
      backgroundColor: colors.neutral[200],
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: typography.h3,
      color: colors.texts.secondary,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    placeholderSubtext: {
      fontSize: typography.body,
      color: colors.texts.secondary,
      textAlign: 'center',
      opacity: 0.7,
    },
    // Имитация маркеров кофеен на карте
    marker: {
      position: 'absolute',
      width: 40,
      height: 40,
      backgroundColor: colors.primary.main,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.white,
      shadowColor: colors.shadows.medium,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    markerText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.white,
    },
    // Кнопка переключения вида (если нужна)
    toggleButton: {
      position: 'absolute',
      top: spacing.lg,
      right: spacing.lg,
      backgroundColor: colors.backgrounds.card,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      shadowColor: colors.shadows.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    toggleButtonText: {
      fontSize: typography.caption,
      color: colors.texts.primary,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.mapArea}>
        <Text style={styles.placeholderText}>🗺️</Text>
        <Text style={styles.placeholderText}>Карта</Text>
        <Text style={styles.placeholderSubtext}>
          Здесь будет интерактивная карта{'\n'}с кофейнями
        </Text>
      </View>

      {/* Имитация маркеров кофеен */}
      {showCoffeeShops && (
        <>
          <View style={[styles.marker, { top: '30%', left: '25%' }]}>
            <Text style={styles.markerText}>☕</Text>
          </View>
          <View style={[styles.marker, { top: '45%', right: '30%' }]}>
            <Text style={styles.markerText}>☕</Text>
          </View>
          <View style={[styles.marker, { bottom: '35%', left: '40%' }]}>
            <Text style={styles.markerText}>☕</Text>
          </View>
          <View style={[styles.marker, { bottom: '25%', right: '25%' }]}>
            <Text style={styles.markerText}>☕</Text>
          </View>
        </>
      )}

      {/* Кнопка переключения вида */}
      {onToggleView && (
        <TouchableOpacity style={styles.toggleButton} onPress={onToggleView}>
          <Text style={styles.toggleButtonText}>Список</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
