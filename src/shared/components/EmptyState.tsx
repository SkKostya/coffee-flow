// src/shared/components/EmptyState.tsx
// Компонент для отображения пустых состояний

import { Ionicons } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '../hooks/useColors';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  iconSize?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document-outline',
  title,
  message,
  actionText,
  onAction,
  iconSize = 80,
}) => {
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    icon: {
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.texts.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    message: {
      fontSize: 16,
      color: colors.texts.secondary,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 22,
    },
    button: {
      borderRadius: 8,
      paddingHorizontal: 24,
    },
  });

  return (
    <View style={styles.container}>
      <Ionicons
        name={icon as any}
        size={iconSize}
        color={colors.texts.secondary}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionText && onAction && (
        <Button
          title={actionText}
          onPress={onAction}
          buttonStyle={styles.button}
          color="primary"
        />
      )}
    </View>
  );
};

export default EmptyState;
