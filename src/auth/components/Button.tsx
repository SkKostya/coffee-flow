import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {
  getResponsiveFormSizes,
  getResponsiveTypography,
} from '../../shared/constants/responsiveStyles';
import useColors from '../../shared/hooks/useColors';
import useResponsive from '../../shared/hooks/useResponsive';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  disabled = false,
  loading = false,
}) => {
  const colors = useColors();
  const { currentBreakpoint } = useResponsive();

  const formSizes = getResponsiveFormSizes(currentBreakpoint);
  const typography = getResponsiveTypography(currentBreakpoint);

  const isDisabled = disabled || loading;

  const buttonStyle =
    variant === 'primary'
      ? [
          styles.button,
          styles.primaryButton,
          {
            backgroundColor: isDisabled
              ? colors.colors.neutral[300]
              : colors.colors.primary[500],
            height: formSizes.buttonHeight,
            borderRadius: formSizes.borderRadius,
            marginBottom: formSizes.gap / 2,
          },
          style,
        ]
      : [
          styles.button,
          styles.secondaryButton,
          {
            backgroundColor: colors.backgrounds.input,
            borderColor: isDisabled
              ? colors.colors.neutral[300]
              : colors.colors.primary[500],
            borderWidth: 1,
            height: formSizes.buttonHeight,
            borderRadius: formSizes.borderRadius,
            marginBottom: formSizes.gap / 2,
          },
          style,
        ];

  const textStyle = [
    styles.buttonText,
    {
      fontSize: typography.body,
      color:
        variant === 'primary'
          ? colors.colors.white
          : isDisabled
          ? colors.colors.neutral[400]
          : colors.colors.primary[500],
    },
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={isDisabled ? 1 : 0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary'
              ? colors.colors.white
              : colors.colors.primary[500]
          }
          size="small"
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    // Primary button styles are applied inline
  },
  secondaryButton: {
    // Secondary button styles are applied inline
  },
  buttonText: {
    fontWeight: '600',
  },
});

export default Button;
