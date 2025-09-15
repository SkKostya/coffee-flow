// src/shared/components/ErrorMessage.tsx
// Компонент для отображения ошибок

import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '@rneui/themed';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '../hooks/useColors';

interface ErrorMessageProps {
  error: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  title?: string;
  showRetry?: boolean;
  showDismiss?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss,
  title = 'Ошибка',
  showRetry = true,
  showDismiss = false,
}) => {
  const colors = useColors();

  if (!error) return null;

  const styles = StyleSheet.create({
    container: {
      margin: 16,
    },
    card: {
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.error.main,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    icon: {
      marginRight: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.texts.primary,
      flex: 1,
    },
    message: {
      fontSize: 14,
      color: colors.texts.secondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
    button: {
      borderRadius: 8,
      paddingHorizontal: 16,
    },
    retryButton: {
      backgroundColor: colors.primary.main,
    },
    dismissButton: {
      backgroundColor: colors.texts.disabled,
    },
  });

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <View style={styles.header}>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color={colors.error.main}
            style={styles.icon}
          />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.message}>{error}</Text>
        {(showRetry || showDismiss) && (
          <View style={styles.actions}>
            {showDismiss && onDismiss && (
              <Button
                title="Закрыть"
                onPress={onDismiss}
                buttonStyle={[styles.button, styles.dismissButton]}
                size="sm"
              />
            )}
            {showRetry && onRetry && (
              <Button
                title="Повторить"
                onPress={onRetry}
                buttonStyle={[styles.button, styles.retryButton]}
                size="sm"
              />
            )}
          </View>
        )}
      </Card>
    </View>
  );
};

export default ErrorMessage;
