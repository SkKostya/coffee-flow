import { Ionicons } from '@expo/vector-icons';
import { Button, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '../../shared';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onDismiss,
}) => {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View
        style={[styles.iconContainer, { backgroundColor: colors.error.light }]}
      >
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={colors.error.main}
        />
      </View>

      <Text style={[styles.title, { color: colors.texts.primary }]}>
        Произошла ошибка
      </Text>

      <Text style={[styles.errorText, { color: colors.texts.secondary }]}>
        {error}
      </Text>

      <View style={styles.buttonContainer}>
        {onRetry && (
          <Button
            title="Повторить"
            type="solid"
            color="primary"
            buttonStyle={[
              styles.retryButton,
              { backgroundColor: colors.primary.main },
            ]}
            titleStyle={[styles.buttonText, { color: colors.texts.primary }]}
            onPress={onRetry}
          />
        )}

        {onDismiss && (
          <Button
            title="Закрыть"
            type="outline"
            color="primary"
            buttonStyle={[
              styles.dismissButton,
              { borderColor: colors.primary.main },
            ]}
            titleStyle={[styles.buttonText, { color: colors.primary.main }]}
            onPress={onDismiss}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  retryButton: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  dismissButton: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ErrorState;
