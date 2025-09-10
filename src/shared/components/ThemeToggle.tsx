import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../store';
import useColors from '../hooks/useColors';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const Colors = useColors();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
      default:
        return isDark ? '🌙' : '☀️';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
      default:
        return 'System';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: Colors.backgrounds.elevated,
          shadowColor: Colors.shadows.medium,
        },
      ]}
      onPress={toggleTheme}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: Colors.primary.light },
        ]}
      >
        <Text style={styles.icon}>{getThemeIcon()}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: Colors.texts.secondary }]}>
          Theme
        </Text>
        <Text style={[styles.value, { color: Colors.texts.primary }]}>
          {getThemeLabel()}
        </Text>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={[styles.arrow, { color: Colors.texts.secondary }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ThemeToggle;
