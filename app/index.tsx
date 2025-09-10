import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthStatus } from '../src/auth/components';
import { useColors } from '../src/shared/hooks';
import { useTheme } from '../src/store';

export default function Index() {
  const colors = useColors();
  const { toggleTheme, theme } = useTheme();

  // Фиксированные размеры для мобильных устройств
  const spacing = { lg: 24, xl: 32, md: 16, sm: 8 };
  const typography = { h1: 32, body: 16, caption: 14, small: 12 };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    title: {
      marginTop: 48,
      fontSize: typography.h1,
      fontWeight: 'bold',
      color: colors.texts.primary,
      marginBottom: spacing.xl,
      textAlign: 'center',
    },
    button: {
      backgroundColor: colors.primary.main,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: 12,
      marginBottom: spacing.md,
      minWidth: 200,
    },
    buttonText: {
      fontSize: typography.body,
      fontWeight: '600',
      color: colors.primary.contrast,
      textAlign: 'center',
    },
    secondaryButton: {
      backgroundColor: colors.backgrounds.secondary,
      borderWidth: 1,
      borderColor: colors.borders.primary,
    },
    secondaryButtonText: {
      color: colors.texts.primary,
    },
    themeButton: {
      position: 'absolute',
      top: spacing.xl,
      right: spacing.lg,
      backgroundColor: colors.backgrounds.secondary,
      padding: spacing.sm,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.borders.subtle,
    },
    themeButtonText: {
      fontSize: typography.caption,
      color: colors.texts.primary,
    },
    deviceInfo: {
      position: 'absolute',
      bottom: spacing.xl,
      left: spacing.lg,
      right: spacing.lg,
      backgroundColor: colors.backgrounds.secondary,
      padding: spacing.md,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.borders.subtle,
    },
    deviceInfoText: {
      fontSize: typography.small,
      color: colors.texts.secondary,
      textAlign: 'center',
    },
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.backgrounds.primary }}
    >
      <View style={styles.container}>
        {/* Кнопка переключения темы */}
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <Text style={styles.themeButtonText}>
            {theme === 'light' ? '🌙' : theme === 'dark' ? '☀️' : '🔄'} {theme}
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>Coffee Flow ☕</Text>

        <AuthStatus
          onLoginPress={() => router.navigate('/auth/login')}
          onLogoutPress={() => router.navigate('/')}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.navigate('/coffee-shops')}
        >
          <Text style={styles.buttonText}>Найти кофейни</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.navigate('/auth/login')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Авторизация
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.navigate('/menu')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Меню
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.navigate('/cart')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Корзина
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.navigate('/checkout')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Оформление заказа
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.navigate('/orders')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Мои заказы
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.navigate('/favorites')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Избранное
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.navigate('/profile')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Профиль
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.navigate('/city-demo')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Выбор города
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.navigate('/onboarding')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Онбординг
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
