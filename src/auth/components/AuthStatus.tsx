import { Button } from '@rneui/themed';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '../../shared/hooks/useColors';
import { useAuth } from '../../store';

interface AuthStatusProps {
  onLoginPress?: () => void;
  onLogoutPress?: () => void;
}

const AuthStatus: React.FC<AuthStatusProps> = ({
  onLoginPress,
  onLogoutPress,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const colors = useColors();

  const handleLogout = async () => {
    try {
      await logout();
      if (onLogoutPress) {
        onLogoutPress();
      }
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: colors.texts.secondary }]}>
          Вы не авторизованы
        </Text>
        {onLoginPress && (
          <Button
            title="Войти"
            onPress={onLoginPress}
            color="primary"
            size="sm"
            style={styles.button}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.texts.primary }]}>
        Добро пожаловать, {user.firstName} {user.lastName}!
      </Text>
      <Text style={[styles.phone, { color: colors.texts.secondary }]}>
        {user.phoneNumber}
      </Text>
      <Button
        title="Выйти"
        onPress={handleLogout}
        color="secondary"
        size="sm"
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});

export default AuthStatus;
