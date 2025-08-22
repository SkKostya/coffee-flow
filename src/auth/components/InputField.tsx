import React from 'react';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  getResponsiveFormSizes,
  getResponsiveTypography,
} from '../../shared/constants/responsiveStyles';
import useColors from '../../shared/hooks/useColors';
import useResponsive from '../../shared/hooks/useResponsive';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  isInvalid?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
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
            marginBottom: formSizes.gap / 2,
          },
        ]}
      >
        {label}
      </Text>
      <TextInput
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
        placeholder={placeholder}
        placeholderTextColor={colors.texts.disabled}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
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
    marginBottom: 24,
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

export default InputField;
