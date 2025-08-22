import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  getResponsiveFormSizes,
  getResponsiveTypography,
} from '../../shared/constants/responsiveStyles';
import useColors from '../../shared/hooks/useColors';
import useResponsive from '../../shared/hooks/useResponsive';

interface FormErrorProps {
  message?: string;
}

const FormError: React.FC<FormErrorProps> = ({ message }) => {
  const colors = useColors();
  const { currentBreakpoint } = useResponsive();

  const formSizes = getResponsiveFormSizes(currentBreakpoint);
  const typography = getResponsiveTypography(currentBreakpoint);

  if (!message) return null;

  return (
    <View
      style={[
        styles.errorContainer,
        {
          borderRadius: formSizes.borderRadius / 2,
          padding: formSizes.gap / 2,
          marginBottom: formSizes.gap / 2,
        },
      ]}
    >
      <Text
        style={[
          styles.errorText,
          {
            color: colors.colors.error[500],
            fontSize: typography.caption,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  errorText: {
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default FormError;
