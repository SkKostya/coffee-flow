import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '../../shared/hooks/useColors';

const CoffeeLogo: React.FC = () => {
  const colors = useColors();

  // Фиксированные размеры для мобильных устройств
  const logoSize = { width: 120, height: 120 };
  const spacing = { xxl: 32 };

  return (
    <View style={[styles.logoContainer, { marginBottom: spacing.xxl }]}>
      <View
        style={[
          styles.logoWrapper,
          {
            width: logoSize.width,
            height: logoSize.height,
          },
        ]}
      >
        <Image
          source={require('../../../assets/images/splash-icon.png')}
          style={[
            styles.logo,
            { width: logoSize.width, height: logoSize.height },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  logoWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  logo: {
    borderRadius: 20,
  },
});

export default CoffeeLogo;
