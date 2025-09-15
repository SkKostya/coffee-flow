// src/shared/components/LoadingSpinner.tsx
// Компонент для отображения состояний загрузки

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useColors } from '../hooks/useColors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  message?: string;
  overlay?: boolean;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  message = 'Загрузка...',
  overlay = false,
  color,
}) => {
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      flex: overlay ? 1 : 0,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: overlay ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
      position: overlay ? 'absolute' : 'relative',
      top: overlay ? 0 : undefined,
      left: overlay ? 0 : undefined,
      right: overlay ? 0 : undefined,
      bottom: overlay ? 0 : undefined,
      zIndex: overlay ? 1000 : undefined,
    },
    content: {
      backgroundColor: overlay ? colors.backgrounds.elevated : 'transparent',
      padding: overlay ? 20 : 0,
      borderRadius: overlay ? 12 : 0,
      alignItems: 'center',
    },
    text: {
      marginTop: 12,
      fontSize: 16,
      color: colors.texts.secondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color || colors.primary.main} />
        {message && <Text style={styles.text}>{message}</Text>}
      </View>
    </View>
  );
};

export default LoadingSpinner;
