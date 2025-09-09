import { Input } from '@rneui/themed';
import React from 'react';
import {
  KeyboardTypeOptions,
  TextInput,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useColors } from '../../shared/hooks/useColors';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  isInvalid?: boolean;
  returnKeyType?: 'next' | 'done' | 'go' | 'search' | 'send' | 'default';
  onSubmitEditing?: () => void;
}

const InputField = React.forwardRef<TextInput, InputFieldProps>(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      secureTextEntry = false,
      keyboardType = 'default',
      error,
      isInvalid = false,
      returnKeyType = 'next',
      onSubmitEditing,
    },
    ref
  ) => {
    const colors = useColors();

    // Фиксированные размеры для мобильных устройств
    const formSizes = {
      inputHeight: 48,
      borderRadius: 12,
      paddingHorizontal: 16,
      gap: 16,
    };
    const typography = { body: 16, caption: 14 };

    // Стили для контейнера инпута
    const containerStyle: ViewStyle = {
      marginBottom: 16,
      paddingHorizontal: 0,
    };

    // Стили для самого инпута
    const inputStyle: TextStyle = {
      height: formSizes.inputHeight,
      borderRadius: formSizes.borderRadius,
      paddingHorizontal: formSizes.paddingHorizontal / 2,
      fontSize: typography.body,
      color: colors.texts.primary,
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

    // Стили для контейнера инпута
    const inputContainerStyle: ViewStyle = {
      backgroundColor: colors.backgrounds.input,
      borderColor: isInvalid
        ? colors.colors.error[500]
        : colors.borders.primary,
      borderWidth: isInvalid ? 2 : 1,
      borderRadius: formSizes.borderRadius,
      paddingHorizontal: 12,
      minHeight: formSizes.inputHeight,
      // Добавляем тень для лучшего внешнего вида
      shadowColor: colors.colors.primary[500],
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    };

    // Стили для placeholder
    const placeholderStyle: TextStyle = {
      color: colors.texts.secondary,
      fontSize: typography.body,
    };

    return (
      <Input
        ref={ref}
        label={label}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        errorMessage={error}
        containerStyle={containerStyle}
        inputStyle={inputStyle}
        labelStyle={labelStyle}
        errorStyle={error ? errorStyle : { height: 0 }}
        inputContainerStyle={inputContainerStyle}
        placeholderTextColor={colors.texts.secondary}
        // Добавляем дополнительные пропсы для лучшего внешнего вида
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
      />
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
