import { formatPhoneNumber } from '@/src/shared/helpers/specific-tools';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useMaskedInputProps } from 'react-native-mask-input';
import { useEditAccountForm } from '../src/profile';
import FormField from '../src/shared/components/FormField';
import FormScreen from '../src/shared/components/FormScreen';
import { useColors } from '../src/shared/hooks/useColors';
import { useProfile } from '../src/store';

export default function EditAccountScreen() {
  const colors = useColors();
  const { profile, isLoading } = useProfile();

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    errors,
    isValid,
    isSubmitting,
    formError,
    hasChanges,
    updateFirstName,
    updateLastName,
    updateEmail,
    updatePhoneNumber,
    handleSubmit,
    setValue,
  } = useEditAccountForm({
    initialFirstName: '',
    initialLastName: '',
    initialEmail: '',
    initialPhone: '',
  });

  // Обновляем форму при загрузке данных профиля
  useEffect(() => {
    if (profile && !isLoading) {
      setValue('firstName', profile.firstName || '');
      setValue('lastName', profile.lastName || '');
      setValue('email', profile.email || '');
      setValue('phoneNumber', formatPhoneNumber(profile.phoneNumber || ''));
    }
  }, [profile, isLoading, setValue]);

  const maskedInputProps = useMaskedInputProps({
    mask: [
      '+',
      /\d/,
      ' ',
      '(',
      /\d/,
      /\d/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
    ],
    value: phoneNumber,
    onChangeText: updatePhoneNumber,
  });

  // Показываем индикатор загрузки пока данные профиля не загружены
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
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          minHeight: '100%',
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormScreen
          title="Изменение учетной записи"
          saveButtonText="Сохранить"
          onSave={handleSubmit}
          isValid={isValid}
          hasChanges={hasChanges}
          isSubmitting={isSubmitting}
          formError={formError}
        >
          <FormField
            label="Имя"
            value={firstName}
            onChangeText={updateFirstName}
            placeholder="Введите имя"
            error={errors.firstName?.message}
            returnKeyType="next"
          />

          <FormField
            label="Фамилия"
            value={lastName}
            onChangeText={updateLastName}
            placeholder="Введите фамилию"
            error={errors.lastName?.message}
            returnKeyType="next"
          />

          <FormField
            label="Email адрес"
            value={email || ''}
            onChangeText={updateEmail}
            placeholder="Введите email адрес"
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />

          <FormField
            label="Номер телефона"
            value={phoneNumber}
            onChangeText={updatePhoneNumber}
            placeholder="+7 (___) ___-__-__"
            error={errors.phoneNumber?.message}
            keyboardType="phone-pad"
            maskedInputProps={maskedInputProps}
            disabled={true}
            returnKeyType="done"
          />
        </FormScreen>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
