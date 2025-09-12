import { Input, InputProps, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import MaskedInput from 'react-native-mask-input';
import { useColors } from '../hooks/useColors';

interface FormFieldProps extends InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'phone-pad' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maskedInputProps?: any;
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  maskedInputProps,
  containerStyle,
  disabled = false,
  ...inputProps
}) => {
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    label: {
      fontSize: 16,
      color: colors.texts.secondary,
      marginBottom: 8,
      fontWeight: '500',
    },
    inputContainerStyle: {
      borderBottomWidth: 0,
      backgroundColor: colors.backgrounds.input,
      borderWidth: 0,
    },
    input: {
      backgroundColor: colors.backgrounds.input,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: error ? colors.error.main : colors.borders.primary,
      fontSize: 16,
      color: colors.texts.primary,
    },
    maskedInput: {
      backgroundColor: colors.backgrounds.input,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: error ? colors.error.main : colors.borders.primary,
      fontSize: 16,
      color: colors.texts.primary,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    fieldError: {
      color: colors.error.main,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      {maskedInputProps ? (
        <MaskedInput
          {...maskedInputProps}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.texts.secondary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          style={styles.maskedInput}
          editable={!disabled}
        />
      ) : (
        <Input
          {...inputProps}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.texts.secondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          inputStyle={styles.input}
          containerStyle={{ paddingHorizontal: 0 }}
          inputContainerStyle={styles.inputContainerStyle}
          style={{ color: colors.texts.primary }}
          errorStyle={{ height: 0 }}
          errorMessage={undefined}
          disabled={disabled}
        />
      )}
      {error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
};

export default FormField;
