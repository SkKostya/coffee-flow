import { Ionicons } from '@expo/vector-icons';
import { Input } from '@rneui/themed';
import React, { useState } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { useColors } from '../../shared/hooks/useColors';

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Фиксированные размеры для мобильных устройств
  const formSizes = { inputHeight: 48, gap: 16 };
  const typography = { body: 16, caption: 14 };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Стили для контейнера инпута
  const containerStyle: ViewStyle = {
    marginBottom: 12,
  };

  // Стили для самого инпута
  const inputStyle: TextStyle = {
    height: formSizes.inputHeight,
    fontSize: typography.body,
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
    marginTop: formSizes.gap / 4,
    marginLeft: formSizes.gap / 6,
    fontWeight: '400',
  };

  // Правая иконка для показа/скрытия пароля
  const rightIcon = (
    <Ionicons
      name={isPasswordVisible ? 'eye-off' : 'eye'}
      size={20}
      color={colors.texts.secondary}
      onPress={togglePasswordVisibility}
    />
  );

  return (
    <Input
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!isPasswordVisible}
      autoCapitalize="none"
      autoCorrect={false}
      errorMessage={error}
      rightIcon={rightIcon}
      containerStyle={containerStyle}
      inputStyle={inputStyle}
      labelStyle={labelStyle}
      errorStyle={error ? errorStyle : { height: 0 }}
      // Используем цвета темы React Native Elements
      inputContainerStyle={[
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

export default PasswordInput;
