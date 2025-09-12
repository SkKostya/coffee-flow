import { Icon, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useColors } from '../../shared/hooks/useColors';
import type { City } from '../types';

interface CityItemProps {
  city: City;
  isSelected: boolean;
  onPress: (city: City) => void;
}

const CityItem: React.FC<CityItemProps> = React.memo(
  ({ city, isSelected, onPress }) => {
    const colors = useColors();

    return (
      <TouchableOpacity
        style={[
          styles.cityItem,
          {
            backgroundColor: colors.backgrounds.elevated,
          },
        ]}
        onPress={() => onPress(city)}
        activeOpacity={0.7}
      >
        <View style={styles.cityContent}>
          <View style={styles.cityInfo}>
            <Text
              style={[
                styles.cityName,
                {
                  color: colors.texts.primary,
                  fontWeight: isSelected ? '600' : '400',
                },
              ]}
            >
              {city.nameRu || city.name}
            </Text>
            <Text
              style={[styles.cityRegion, { color: colors.texts.secondary }]}
            >
              {city.name}
            </Text>
          </View>
          {isSelected && (
            <Icon
              name="checkmark-circle"
              type="ionicon"
              color={colors.primary.main}
              size={24}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  cityItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 2,
  },
  cityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    marginBottom: 4,
  },
  cityRegion: {
    fontSize: 14,
  },
});

CityItem.displayName = 'CityItem';

export default CityItem;
