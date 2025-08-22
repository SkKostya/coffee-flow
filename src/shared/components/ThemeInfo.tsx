import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';
import useColors from '../hooks/useColors';

const ThemeInfo: React.FC = () => {
  const { theme, isDark } = useTheme();
  const colors = useColors();

  const getThemeDescription = () => {
    switch (theme) {
      case 'light':
        return 'Using light theme';
      case 'dark':
        return 'Using dark theme';
      case 'system':
      default:
        return `Using system theme (${isDark ? 'dark' : 'light'})`;
    }
  };

  const getThemeColor = () => {
    switch (theme) {
      case 'light':
        return Colors.primary[500];
      case 'dark':
        return Colors.secondary[500];
      case 'system':
      default:
        return isDark ? Colors.secondary[500] : Colors.primary[500];
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.backgrounds.secondary,
            borderColor: colors.borders.primary,
          },
        ]}
      >
        <View
          style={[styles.indicator, { backgroundColor: getThemeColor() }]}
        />
        <Text style={[styles.text, { color: colors.texts.primary }]}>
          {getThemeDescription()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ThemeInfo;
