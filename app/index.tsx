import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ResponsiveDebugger } from '../src/shared/components';
import {
  getResponsiveSpacing,
  getResponsiveTypography,
} from '../src/shared/constants/responsiveStyles';
import { useTheme } from '../src/shared/contexts/ThemeContext';
import { useColors, useResponsive } from '../src/shared/hooks';

export default function Index() {
  const router = useRouter();
  const colors = useColors();
  const { toggleTheme, theme } = useTheme();
  const { currentBreakpoint, isMobile } = useResponsive();
  const spacing = getResponsiveSpacing(currentBreakpoint);
  const typography = getResponsiveTypography(currentBreakpoint);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    title: {
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

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/coffeeshops')}
        >
          <Text style={styles.buttonText}>Найти кофейни</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/auth')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Авторизация
          </Text>
        </TouchableOpacity>

        {/* Отладочная информация об адаптивности */}
        <ResponsiveDebugger />

        {/* Информация об адаптивности */}
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceInfoText}>
            Текущий брейкпоинт: {currentBreakpoint} •{' '}
            {isMobile ? 'Мобильная' : 'Планшетная'} версия
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
