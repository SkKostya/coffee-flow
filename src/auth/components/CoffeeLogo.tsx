import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  getResponsiveLogoSize,
  getResponsiveSpacing,
} from '../../shared/constants/responsiveStyles';
import useResponsive from '../../shared/hooks/useResponsive';

const CoffeeLogo: React.FC = () => {
  const { currentBreakpoint } = useResponsive();

  const logoSize = getResponsiveLogoSize(currentBreakpoint);
  const spacing = getResponsiveSpacing(currentBreakpoint);

  return (
    <View style={[styles.logoContainer, { marginBottom: spacing.xxl }]}>
      <Image
        source={require('../../../assets/images/splash-icon.png')}
        style={{ width: logoSize.width, height: logoSize.height }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
});

export default CoffeeLogo;
