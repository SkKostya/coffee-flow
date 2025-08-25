import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  getResponsiveSpacing,
  getResponsiveTypography,
} from '../constants/responsiveStyles';
import { useColors, useResponsive } from '../hooks';

interface BottomNavigationProps {
  activeTab: 'map' | 'favorites' | 'profile';
  onTabPress: (tab: 'map' | 'favorites' | 'profile') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  const colors = useColors();
  const { currentBreakpoint } = useResponsive();
  const spacing = getResponsiveSpacing(currentBreakpoint);
  const typography = getResponsiveTypography(currentBreakpoint);

  const tabs = [
    {
      id: 'map' as const,
      icon: '🗺️',
      label: 'Карта',
    },
    {
      id: 'favorites' as const,
      icon: '❤️',
      label: 'Избранные',
    },
    {
      id: 'profile' as const,
      icon: '👤',
      label: 'Профиль',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.backgrounds.card,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.borders.subtle,
      shadowColor: colors.shadows.light,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xs,
    },
    activeTab: {
      backgroundColor: colors.primary.main,
      borderRadius: 20,
      paddingHorizontal: spacing.md,
    },
    icon: {
      fontSize: typography.h3,
      marginBottom: spacing.xs / 2,
    },
    label: {
      fontSize: typography.small,
      fontWeight: '500',
    },
    activeLabel: {
      color: colors.primary.contrast,
    },
    inactiveLabel: {
      color: colors.texts.secondary,
    },
  });

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text
              style={[
                styles.label,
                isActive ? styles.activeLabel : styles.inactiveLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
