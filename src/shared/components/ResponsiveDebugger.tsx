import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors, useResponsive } from '../hooks';

export const ResponsiveDebugger: React.FC = () => {
  const colors = useColors();
  const { isMobile, isTablet, currentBreakpoint, screenWidth, screenHeight } =
    useResponsive();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgrounds.card,
      padding: 16,
      margin: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isMobile ? colors.success.main : colors.primary.main,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.texts.primary,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.texts.secondary,
    },
    value: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.texts.primary,
    },
    breakpointIndicator: {
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
      marginTop: 12,
      padding: 8,
      borderRadius: 8,
      backgroundColor: isMobile ? colors.success.light : colors.primary.light,
      color: isMobile ? colors.success.contrast : colors.primary.contrast,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Responsive Debugger</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Ширина экрана:</Text>
        <Text style={styles.value}>{screenWidth}px</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Высота экрана:</Text>
        <Text style={styles.value}>{screenHeight}px</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Мобильный:</Text>
        <Text style={styles.value}>{isMobile ? '✅ Да' : '❌ Нет'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Планшет:</Text>
        <Text style={styles.value}>{isTablet ? '✅ Да' : '❌ Нет'}</Text>
      </View>

      <Text style={styles.breakpointIndicator}>
        Текущий breakpoint: {currentBreakpoint.toUpperCase()}
      </Text>
    </View>
  );
};
