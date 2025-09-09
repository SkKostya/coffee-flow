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
  InputField,
  PasswordInput,
  PhoneInput,
  useRegistrationForm,
} from '../../src/auth';

const RegisterScreen: React.FC = () => {
  const colors = useColors();

  const {
    phoneNumber,
    firstName,
    lastName,
    password,
    errors,
    isValid,
    isSubmitting,
    formError,
    updatePhoneNumber,
    updateFirstName,
    updateLastName,
    updatePassword,
    handleRegistration,
  } = useRegistrationForm();

  const handleLoginPress = () => {
    router.navigate('/auth/login');
  };

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
          <Text h2 style={[styles.title, { color: colors.texts.primary }]}>
            Регистрация
          </Text>

          <Text style={[styles.subtitle, { color: colors.texts.secondary }]}>
            Создайте аккаунт для заказа кофе
          </Text>

          {formError && <FormError message={formError} />}

          <View style={styles.form}>
            <PhoneInput
              label="Номер телефона"
              value={phoneNumber}
              onChangeText={updatePhoneNumber}
              error={errors.phoneNumber?.message}
              isInvalid={!!errors.phoneNumber}
            />

            <InputField
              label="Имя"
              placeholder="Введите ваше имя"
              value={firstName}
              onChangeText={updateFirstName}
              error={errors.firstName?.message}
              isInvalid={!!errors.firstName}
            />

            <InputField
              label="Фамилия"
              placeholder="Введите вашу фамилию"
              value={lastName}
              onChangeText={updateLastName}
              error={errors.lastName?.message}
              isInvalid={!!errors.lastName}
            />

            <PasswordInput
              label="Пароль"
              placeholder="Введите пароль"
              value={password}
              onChangeText={updatePassword}
              error={errors.password?.message}
              isInvalid={!!errors.password}
            />

            <AuthButton
              title="Зарегистрироваться"
              onPress={handleRegistration}
              variant="primary"
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              style={styles.submitButton}
            />

            <View style={styles.loginContainer}>
              <Text
                style={[styles.loginText, { color: colors.texts.secondary }]}
              >
                Уже есть аккаунт?{' '}
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
});

export default RegisterScreen;
