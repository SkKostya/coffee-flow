import { Stack, router } from 'expo-router';
import React, { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  Button,
  CoffeeLogo,
  ForgotPasswordLink,
  FormError,
  PasswordInput,
  PhoneInput,
} from '../../src/auth/components';
import { useAuthForm } from '../../src/auth/hooks';
import { useColors } from '../../src/shared/hooks';

export default function AuthScreen() {
  const colors = useColors();

  // Ref для навигации между полями
  const passwordRef = useRef<TextInput>(null);

  const {
    phoneNumber,
    password,
    errors,
    isValid,
    isSubmitting,
    formError,
    updatePhoneNumber,
    updatePassword,
    handleLogin,
  } = useAuthForm();

  // Фиксированные размеры для мобильных устройств
  const formSizes = { paddingHorizontal: 24 };
  const spacing = { xl: 32 };

  const handleForgotPassword = () => {
    router.navigate('/auth/reset-password');
  };

  const handleRegisterPress = () => {
    router.navigate('/auth/register');
  };

  // Обработчики для навигации между полями
  const focusPassword = () => {
    passwordRef.current?.focus();
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgrounds.primary },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.backgrounds.primary}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.content,
              { paddingHorizontal: formSizes.paddingHorizontal },
            ]}
          >
            <CoffeeLogo />

            <View style={[styles.formContainer, { marginBottom: spacing.xl }]}>
              <PhoneInput
                label="Номер телефона"
                value={phoneNumber}
                onChangeText={updatePhoneNumber}
                error={errors.phoneNumber?.message}
                isInvalid={!!errors.phoneNumber}
                returnKeyType="next"
                onSubmitEditing={focusPassword}
              />

              <PasswordInput
                ref={passwordRef}
                label="Пароль"
                placeholder="Введите пароль"
                value={password}
                onChangeText={updatePassword}
                error={errors.password?.message}
                isInvalid={!!errors.password}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            {formError && (
              <View style={{ marginBottom: 16 }}>
                <FormError message={formError} />
              </View>
            )}

            <View
              style={[styles.buttonsContainer, { marginBottom: spacing.xl }]}
            >
              <Button
                title="Авторизоваться"
                onPress={handleLogin}
                variant="primary"
                disabled={!isValid || Object.keys(errors).length > 0}
                loading={isSubmitting}
              />

              <Button
                title="Регистрация"
                onPress={handleRegisterPress}
                variant="secondary"
              />
            </View>

            <ForgotPasswordLink onPress={handleForgotPassword} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  content: {
    flex: 1,
    paddingTop: 80, // Увеличиваем отступ сверху
    paddingBottom: 40,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  formContainer: {
    // marginBottom будет установлен динамически
  },
  buttonsContainer: {
    // marginBottom будет установлен динамически
  },
  // Планшетный layout
  tabletContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 64, // Увеличиваем отступы для планшета
    paddingVertical: 40,
  },
  leftPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 64, // Увеличиваем отступы между панелями
  },
  rightPanel: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 64, // Увеличиваем отступы между панелями
    maxWidth: 400, // Ограничиваем максимальную ширину формы
  },
  welcomeText: {
    textAlign: 'center',
  },
  appName: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
});
