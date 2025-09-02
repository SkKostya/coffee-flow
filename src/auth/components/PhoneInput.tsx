import { Input } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useMaskedInputProps } from 'react-native-mask-input';
import { useColors } from '../../shared/hooks/useColors';

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

  const maskedInputProps = useMaskedInputProps({
    mask: [
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
    ],
    value: value,
    onChangeText: onChangeText,
  });

  // Фиксированные размеры для мобильных устройств
  const formSizes = { gap: 16 };
  const typography = { body: 16, caption: 14 };

  // Стили для контейнера инпута
  const containerStyle: ViewStyle = {
    marginBottom: 12,
  };

  // Стили для лейбла
  const labelStyle: TextStyle = {
    color: colors.texts.secondary,
    fontSize: typography.body,
    marginBottom: formSizes.gap / 4,
    fontWeight: '500',
  };

  // Стили для текста ошибки
  const errorStyle: TextStyle = {
    color: colors.colors.error[500],
    fontSize: typography.caption,
    marginTop: error ? formSizes.gap / 4 : 0,
    marginBottom: 0,
    marginLeft: formSizes.gap / 6,
    fontWeight: '400',
  };

  return (
    <Input
      label={label}
      errorMessage={error}
      containerStyle={containerStyle}
      labelStyle={labelStyle}
      errorStyle={errorStyle}
      {...maskedInputProps}
      placeholder="+7 (___) ___-__-__"
      keyboardType="phone-pad"
      // Используем цвета темы React Native Elements
      inputContainerStyle={[
        styles.inputContainer,
        {
          backgroundColor: colors.backgrounds.input,
          borderColor: isInvalid
            ? colors.colors.error[500]
            : colors.borders.primary,
          borderWidth: isInvalid ? 2 : 1,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    // Стили для контейнера инпута
  },
});

export default PhoneInput;
