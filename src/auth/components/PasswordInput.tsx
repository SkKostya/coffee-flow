import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getResponsiveFormSizes,
  getResponsiveTypography,
} from '../../shared/constants/responsiveStyles';
import useColors from '../../shared/hooks/useColors';
import useResponsive from '../../shared/hooks/useResponsive';

interface PasswordInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  isInvalid?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  isInvalid = false,
}) => {
  const colors = useColors();
  const { currentBreakpoint } = useResponsive();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const formSizes = getResponsiveFormSizes(currentBreakpoint);
  const typography = getResponsiveTypography(currentBreakpoint);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

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
      <View style={styles.inputWrapper}>
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
              paddingRight: formSizes.inputHeight / 2, // Место для кнопки глаза
              fontSize: typography.body,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.texts.disabled}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[
            styles.eyeButton,
            {
              right: formSizes.paddingHorizontal / 2,
              top: (formSizes.inputHeight - 20) / 2, // Центрируем иконку
            },
          ]}
          onPress={togglePasswordVisibility}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color={colors.texts.secondary}
          />
        </TouchableOpacity>
      </View>
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
  inputWrapper: {
    position: 'relative',
  },
  inputField: {
    borderWidth: 1,
  },
  eyeButton: {
    position: 'absolute',
    padding: 4,
  },
  errorText: {
    fontWeight: '400',
  },
});

export default PasswordInput;
