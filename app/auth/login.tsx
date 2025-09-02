import { Stack } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
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
import { useAuthForm, useColors } from '../../src/shared/hooks';

export default function AuthScreen() {
  const colors = useColors();
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
    handleRegistration,
  } = useAuthForm();

  // Фиксированные размеры для мобильных устройств
  const formSizes = { paddingHorizontal: 24 };
  const spacing = { xl: 32 };

  const handleForgotPassword = () => {
    console.log('Forgot password');
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
            />

            <PasswordInput
              label="Пароль"
              placeholder="Введите пароль"
              value={password}
              onChangeText={updatePassword}
              error={errors.password?.message}
              isInvalid={!!errors.password}
            />
          </View>

          <FormError message={formError} />

          <View style={[styles.buttonsContainer, { marginBottom: spacing.xl }]}>
            <Button
              title="Авторизоваться"
              onPress={handleLogin}
              variant="primary"
              disabled={!isValid || Object.keys(errors).length > 0}
              loading={isSubmitting}
            />

            <Button
              title="Регистрация"
              onPress={handleRegistration}
              variant="secondary"
              loading={isSubmitting}
            />
          </View>

          <ForgotPasswordLink onPress={handleForgotPassword} />
        </View>
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
  content: {
    flex: 1,
    paddingTop: 80, // Увеличиваем отступ сверху
    paddingBottom: 40,
    justifyContent: 'space-between',
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
