import { Ionicons } from '@expo/vector-icons';
import { Card, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useColors } from '../../shared/hooks/useColors';

interface FormErrorProps {
  message?: string;
  description?: string;
}

const FormError: React.FC<FormErrorProps> = ({ message, description }) => {
  const colors = useColors();

  // Фиксированные размеры для мобильных устройств
  const formSizes = { borderRadius: 12, gap: 16 };
  const typography = { caption: 14, body: 16 };

  if (!message) return null;

  // Стили для контейнера ошибки
  const containerStyle: ViewStyle = {
    marginHorizontal: 0,
    borderRadius: formSizes.borderRadius,
    padding: formSizes.gap,
    borderWidth: 1,
    // Добавляем тень для лучшего внешнего вида
    shadowColor: `${colors.colors.error[500]}10`,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  };

  // Стили для текста ошибки
  const textStyle: TextStyle = {
    color: colors.colors.error[500],
    fontSize: typography.caption,
    fontWeight: '500',
    textAlign: 'left',
    lineHeight: typography.caption * 1.4,
  };

  return (
    <Card
      containerStyle={[
        styles.errorContainer,
        containerStyle,
        {
          backgroundColor: `${colors.colors.error[500]}10`, // 10% прозрачности
          borderColor: `${colors.colors.error[500]}30`, // 30% прозрачности
        },
      ]}
    >
      <View style={styles.errorHeader}>
        <Ionicons
          name="alert-circle"
          size={24}
          color={colors.colors.error[500]}
          style={styles.errorIcon}
        />
        <Text
          style={[textStyle, { fontSize: typography.body, fontWeight: '600' }]}
        >
          {message}
        </Text>
      </View>
      {description && (
        <Text style={[textStyle, { marginTop: 8, marginLeft: 32 }]}>
          {description}
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    position: 'relative',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: 8,
  },
});

export default FormError;
