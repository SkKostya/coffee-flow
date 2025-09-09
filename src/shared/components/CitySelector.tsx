import { Icon, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import type { City } from '../../types';
import { useColors } from '../hooks/useColors';
import { useCoffeeFlowTheme } from '../theme';

interface CitySelectorProps {
  selectedCity: City | null;
  onPress: () => void;
  placeholder?: string;
  disabled?: boolean;
  style?: any;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  onPress,
  placeholder = 'Выберите город',
  disabled = false,
  style,
}) => {
  const { theme } = useCoffeeFlowTheme();
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.backgrounds.elevated,
          borderColor: colors.borders.primary,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.text,
              {
                color: selectedCity
                  ? colors.texts.primary
                  : colors.texts.secondary,
              },
            ]}
          >
            {selectedCity ? selectedCity.name : placeholder}
          </Text>
          {selectedCity && (
            <Text style={[styles.region, { color: colors.texts.secondary }]}>
              {selectedCity.region}
            </Text>
          )}
        </View>
        <Icon
          name="chevron-down"
          type="ionicon"
          color={colors.texts.secondary}
          size={20}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  region: {
    fontSize: 14,
    marginTop: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default CitySelector;
