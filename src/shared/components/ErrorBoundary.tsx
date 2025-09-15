// src/shared/components/ErrorBoundary.tsx
// Компонент для обработки ошибок React

import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '@rneui/themed';
import React, { Component, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '../hooks/useColors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ error: Error | null }> = ({ error }) => {
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.backgrounds.primary,
    },
    card: {
      padding: 20,
      borderRadius: 12,
      width: '100%',
      maxWidth: 400,
    },
    icon: {
      textAlign: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.texts.primary,
      textAlign: 'center',
      marginBottom: 12,
    },
    message: {
      fontSize: 16,
      color: colors.texts.secondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    button: {
      borderRadius: 8,
    },
  });

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Ionicons
          name="warning-outline"
          size={48}
          color={colors.error.main}
          style={styles.icon}
        />
        <Text style={styles.title}>Что-то пошло не так</Text>
        <Text style={styles.message}>
          Произошла неожиданная ошибка. Попробуйте перезапустить приложение.
        </Text>
        <Button
          title="Перезапустить"
          onPress={() => {
            // В реальном приложении здесь будет перезапуск
            console.log('Restart app');
          }}
          buttonStyle={styles.button}
          color="primary"
        />
      </Card>
    </View>
  );
};

export default ErrorBoundary;
