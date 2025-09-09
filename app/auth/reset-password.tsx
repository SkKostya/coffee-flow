import { Button, Text } from '@rneui/themed';
import { router } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useColors } from '@/src/shared';
import {
  Button as AuthButton,
  CoffeeLogo,
  FormError,
  PasswordInput,
  PhoneInput,
  useResetPasswordForm,
} from '../../src/auth';

const ResetPasswordScreen: React.FC = () => {
  const colors = useColors();

  const {
    step,
    phoneNumber,
    formError,
    phoneForm,
    passwordForm,
    goBackToPhone,
  } = useResetPasswordForm();

  const handleLoginPress = () => {
    router.navigate('/auth/login');
  };

  const renderPhoneStep = () => (
    <>
      <Text h2 style={[styles.title, { color: colors.texts.primary }]}>
        Сброс пароля
      </Text>

      <Text style={[styles.subtitle, { color: colors.texts.secondary }]}>
        Введите номер телефона для получения кода восстановления
      </Text>

      {formError && <FormError message={formError} />}

      <View style={styles.form}>
        <PhoneInput
          label="Номер телефона"
          value={phoneForm.phoneNumber}
          onChangeText={phoneForm.updatePhoneNumber}
          error={phoneForm.errors.phoneNumber?.message}
          isInvalid={!!phoneForm.errors.phoneNumber}
        />

        <AuthButton
          title="Отправить код"
          onPress={phoneForm.handleSubmit}
          variant="primary"
          disabled={!phoneForm.isValid || phoneForm.isSubmitting}
          loading={phoneForm.isSubmitting}
          style={styles.submitButton}
        />

        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: colors.texts.secondary }]}>
            Вспомнили пароль?{' '}
          </Text>
          <Button
            type="clear"
            onPress={handleLoginPress}
            titleStyle={[
              styles.loginLink,
              { color: colors.colors.primary[500] },
            ]}
            title="Войти"
            activeOpacity={0.7}
          />
        </View>
      </View>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <Text h2 style={[styles.title, { color: colors.texts.primary }]}>
        Новый пароль
      </Text>

      <Text style={[styles.subtitle, { color: colors.texts.secondary }]}>
        Введите новый пароль для номера {phoneNumber}
      </Text>

      {formError && <FormError message={formError} />}

      <View style={styles.form}>
        <PasswordInput
          label="Новый пароль"
          placeholder="Введите новый пароль"
          value={passwordForm.password}
          onChangeText={passwordForm.updatePassword}
          error={passwordForm.errors.password?.message}
          isInvalid={!!passwordForm.errors.password}
        />

        <PasswordInput
          label="Подтвердите пароль"
          placeholder="Подтвердите новый пароль"
          value={passwordForm.confirmPassword}
          onChangeText={passwordForm.updateConfirmPassword}
          error={passwordForm.errors.confirmPassword?.message}
          isInvalid={!!passwordForm.errors.confirmPassword}
        />

        <AuthButton
          title="Изменить пароль"
          onPress={passwordForm.handleSubmit}
          variant="primary"
          disabled={!passwordForm.isValid || passwordForm.isSubmitting}
          loading={passwordForm.isSubmitting}
          style={styles.submitButton}
        />

        <Button
          type="clear"
          onPress={goBackToPhone}
          titleStyle={[styles.backLink, { color: colors.texts.secondary }]}
          title="← Назад к вводу номера"
          activeOpacity={0.7}
          style={styles.backButton}
        />
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <CoffeeLogo />
        </View>

        <View style={styles.formContainer}>
          {step === 'phone' ? renderPhoneStep() : renderPasswordStep()}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    minHeight: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  loginText: {
    fontSize: 16,
    lineHeight: 24,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  backButton: {
    marginTop: 16,
  },
  backLink: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
});

export default ResetPasswordScreen;
