import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaskInput from 'react-native-mask-input';
import {
  getResponsiveFormSizes,
  getResponsiveTypography,
} from '../../shared/constants/responsiveStyles';
import useColors from '../../shared/hooks/useColors';
import useResponsive from '../../shared/hooks/useResponsive';

interface PhoneInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  isInvalid?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  isInvalid = false,
}) => {
  const colors = useColors();
  const { currentBreakpoint } = useResponsive();

  const formSizes = getResponsiveFormSizes(currentBreakpoint);
  const typography = getResponsiveTypography(currentBreakpoint);

  return (
    <View style={styles.inputContainer}>
      <Text
        style={[
          styles.inputLabel,
          {
            color: colors.texts.secondary,
            fontSize: typography.body,
            marginBottom: formSizes.gap / 4,
          },
        ]}
      >
        {label}
      </Text>
      <MaskInput
        style={[
          styles.inputField,
          {
            backgroundColor: colors.backgrounds.input,
            color: colors.texts.primary,
            borderColor: isInvalid
              ? colors.colors.error[500]
              : colors.borders.primary,
            borderWidth: isInvalid ? 2 : 1,
            height: formSizes.inputHeight,
            borderRadius: formSizes.borderRadius,
            paddingHorizontal: formSizes.paddingHorizontal / 2,
            fontSize: typography.body,
          },
        ]}
        placeholder="+7 (___) ___-__-__"
        placeholderTextColor={colors.texts.disabled}
        value={value}
        onChangeText={onChangeText}
        keyboardType="phone-pad"
        mask={[
          '+',
          /\d/,
          ' ',
          '(',
          /\d/,
          /\d/,
          /\d/,
          ')',
          ' ',
          /\d/,
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
          '-',
          /\d/,
          /\d/,
        ]}
      />
      {error && (
        <Text
          style={[
            styles.errorText,
            {
              color: colors.colors.error[500],
              fontSize: typography.caption,
              marginTop: formSizes.gap / 4,
              marginLeft: formSizes.gap / 6,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontWeight: '500',
  },
  inputField: {
    borderWidth: 1,
  },
  errorText: {
    fontWeight: '400',
  },
});

export default PhoneInput;
