import { Ionicons } from '@expo/vector-icons';
import { Tab } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useColors } from '../hooks';

interface BottomNavigationProps {
  activeTab: 'map' | 'favorites' | 'profile';
  onTabPress: (tab: 'map' | 'favorites' | 'profile') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  const colors = useColors();

  // Фиксированные размеры для мобильных устройств
  const typography = { small: 12 };

  const tabs = [
    {
      id: 'map' as const,
      icon: 'map-outline' as const,
      activeIcon: 'map' as const,
      label: 'Карта',
    },
    {
      id: 'favorites' as const,
      icon: 'heart-outline' as const,
      activeIcon: 'heart' as const,
      label: 'Избранные',
    },
    {
      id: 'profile' as const,
      icon: 'person-outline' as const,
      activeIcon: 'person' as const,
      label: 'Профиль',
    },
  ];

  // Стили для контейнера табов
  const containerStyle: ViewStyle = {
    backgroundColor: colors.backgrounds.card,
    borderTopWidth: 1,
    borderTopColor: colors.borders.subtle,
    shadowColor: colors.shadows.light,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    // Добавляем непрозрачный фон
    opacity: 1,
    // Убеждаемся, что фон полностью непрозрачный
    zIndex: 1000,
  };

  // Стили для индикатора таба
  const indicatorStyle: ViewStyle = {
    backgroundColor: colors.primary.main,
    height: 3,
    borderRadius: 2,
  };

  // Стили для лейбла таба
  const labelStyle: TextStyle = {
    fontSize: typography.small,
    fontWeight: '500',
    textTransform: 'none' as const,
  };

  // Стили для активного лейбла
  const activeLabelStyle: TextStyle = {
    ...labelStyle,
    color: colors.primary.main,
  };

  // Стили для неактивного лейбла
  const inactiveLabelStyle: TextStyle = {
    ...labelStyle,
    color: colors.texts.secondary,
  };

  return (
    <Tab
      value={tabs.findIndex((tab) => tab.id === activeTab)}
      onChange={(value) => onTabPress(tabs[value].id)}
      indicatorStyle={indicatorStyle}
      containerStyle={containerStyle}
      variant="default"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconName = isActive ? tab.activeIcon : tab.icon;

        return (
          <Tab.Item
            key={tab.id}
            value={tab.id}
            title={tab.label}
            titleStyle={isActive ? activeLabelStyle : inactiveLabelStyle}
            icon={({ size }) => (
              <Ionicons
                name={iconName}
                size={size}
                color={isActive ? colors.primary.main : colors.texts.secondary}
              />
            )}
            containerStyle={styles.tabContainer}
          />
        );
      })}
    </Tab>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    paddingVertical: 8,
  },
});

export default BottomNavigation;
