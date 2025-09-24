import { Text } from '@rneui/themed';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../store/hooks/useAuth';
import { useColors } from '../hooks/useColors';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Компонент для инициализации аутентификации
 * Показывает загрузку пока не завершится проверка авторизации
 */
export const AuthInitializer: React.FC<AuthInitializerProps> = ({
  children,
}) => {
  const { isLoading, loadUser } = useAuth();
  const colors = useColors();

  useEffect(() => {
    // Загружаем данные пользователя при монтировании
    loadUser();
  }, [loadUser]);

  // Показываем загрузку пока не завершится инициализация
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.backgrounds.primary,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text
          style={{
            marginTop: 16,
            color: colors.texts.secondary,
            fontSize: 16,
          }}
        >
          Загрузка...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
