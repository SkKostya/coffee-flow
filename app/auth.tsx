import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Button,
  CoffeeLogo,
  ForgotPasswordLink,
  FormError,
  PasswordInput,
  PhoneInput,
} from '../src/auth/components';
import {
  getResponsiveFormSizes,
  getResponsiveSpacing,
  getResponsiveTypography,
} from '../src/shared/constants/responsiveStyles';
import { useAuthForm, useColors, useResponsive } from '../src/shared/hooks';

export default function AuthScreen() {
  const colors = useColors();
  const { currentBreakpoint, isMobile, isTablet } = useResponsive();
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

  const formSizes = getResponsiveFormSizes(currentBreakpoint);
  const spacing = getResponsiveSpacing(currentBreakpoint);
  const typography = getResponsiveTypography(currentBreakpoint);

  const handleForgotPassword = () => {
    console.log('Forgot password');
  };

  // Мобильный layout
  if (isMobile) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.backgrounds.primary },
        ]}
      >
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

            <View
              style={[styles.buttonsContainer, { marginBottom: spacing.xl }]}
            >
              <Button
                title="Авторизоваться"
                onPress={handleLogin}
                variant="primary"
                disabled={!isValid}
                loading={isSubmitting}
              />

              <Button
                title="Регистрация"
                onPress={handleRegistration}
                variant="secondary"
                disabled={!isValid}
                loading={isSubmitting}
              />
            </View>

            <ForgotPasswordLink onPress={handleForgotPassword} />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Планшетный layout
  if (isTablet) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.backgrounds.primary },
        ]}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.backgrounds.primary}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.tabletContainer}>
            {/* Левая панель с логотипом и приветствием */}
            <View style={styles.leftPanel}>
              <CoffeeLogo />
              <Text
                style={[
                  styles.welcomeText,
                  {
                    color: colors.texts.primary,
                    fontSize: typography.h1,
                    marginBottom: spacing.md,
                  },
                ]}
              >
                Добро пожаловать в
              </Text>
              <Text
                style={[
                  styles.appName,
                  {
                    color: colors.colors.primary[500],
                    fontSize: typography.h1,
                    fontWeight: 'bold',
                    marginBottom: spacing.lg,
                  },
                ]}
              >
                Coffee Flow
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: colors.texts.secondary,
                    fontSize: typography.body,
                    textAlign: 'center',
                    paddingHorizontal: spacing.md,
                  },
                ]}
              >
                Войдите в свой аккаунт или создайте новый для доступа к лучшему
                кофе
              </Text>
            </View>

            {/* Правая панель с формой */}
            <View style={styles.rightPanel}>
              <View
                style={[styles.formContainer, { marginBottom: spacing.xl }]}
              >
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

              <View
                style={[styles.buttonsContainer, { marginBottom: spacing.xl }]}
              >
                <Button
                  title="Авторизоваться"
                  onPress={handleLogin}
                  variant="primary"
                  disabled={!isValid}
                  loading={isSubmitting}
                />

                <Button
                  title="Регистрация"
                  onPress={handleRegistration}
                  variant="secondary"
                  disabled={!isValid}
                  loading={isSubmitting}
                />
              </View>

              <ForgotPasswordLink onPress={handleForgotPassword} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Дефолтный layout для больших экранов
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgrounds.primary },
      ]}
    >
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
              disabled={!isValid}
              loading={isSubmitting}
            />

            <Button
              title="Регистрация"
              onPress={handleRegistration}
              variant="secondary"
              disabled={!isValid}
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
    paddingTop: 60,
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
    paddingHorizontal: 48,
  },
  leftPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 48,
  },
  rightPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 48,
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
