import { Divider } from '@rneui/themed';
import React from 'react';
import { StyleSheet } from 'react-native';

import { useColors } from '../../shared/hooks/useColors';

const CitySeparator: React.FC = () => {
  const colors = useColors();

  return (
    <Divider
      style={[styles.separator, { backgroundColor: colors.borders.primary }]}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
});

export default CitySeparator;
