import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { useTheme } from './useTheme';

// Хук для инициализации приложения
export const useAppInitialization = () => {
  const { loadUser } = useAuth();
  const { loadProfile } = useProfile();
  const { updateSystemTheme } = useTheme();
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    // Загружаем данные пользователя при инициализации
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    // Обновляем системную тему при изменении
    const isDark = systemColorScheme === 'dark' || systemColorScheme === null;
    updateSystemTheme(isDark);
  }, [systemColorScheme, updateSystemTheme]);

  // Дополнительная логика инициализации может быть добавлена здесь
  // Например, загрузка профиля после успешной аутентификации
  // Города загружаются в GeneralInitializer
};
