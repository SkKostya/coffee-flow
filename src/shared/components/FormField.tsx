import { Input, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useColors } from '../hooks/useColors';

interface FormFieldProps {
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
    fieldError: {
      color: colors.error.main,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
  });

  const inputProps = maskedInputProps || {
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Input
        {...inputProps}
        inputStyle={styles.input}
        containerStyle={{ paddingHorizontal: 0 }}
        inputContainerStyle={styles.inputContainerStyle}
        style={{ color: colors.texts.primary }}
        errorStyle={{ height: 0 }}
        errorMessage={null}
      />
      {error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
};

export default FormField;
