import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useMaskedInputProps } from 'react-native-mask-input';
import { useEditAccountForm } from '../src/profile';
import FormField from '../src/shared/components/FormField';
import FormScreen from '../src/shared/components/FormScreen';
import { useProfileContext } from '../src/shared/contexts/ProfileContext';
import { useColors } from '../src/shared/hooks/useColors';

export default function EditAccountScreen() {
  const colors = useColors();
  const { profile, isLoading } = useProfileContext();

  const {
    firstName,
    lastName,
    phoneNumber,
    errors,
    isValid,
    isSubmitting,
    formError,
    hasChanges,
    updateFirstName,
    updateLastName,
    updatePhoneNumber,
    handleSubmit,
    setValue,
  } = useEditAccountForm({
    initialFirstName: '',
    initialLastName: '',
    initialPhone: '',
    onSubmit: async (data) => {
      // TODO: Реализовать сохранение данных на сервер
      console.log('Saving account data:', data);
      return { success: true };
    },
  });

  // Обновляем форму при загрузке данных профиля
  useEffect(() => {
    console.log('🔄 Profile data changed:', { profile, isLoading });
    if (profile && !isLoading) {
      console.log('📝 Updating form with profile data:', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
      });
      setValue('firstName', profile.firstName || '');
      setValue('lastName', profile.lastName || '');
      setValue('phoneNumber', profile.phoneNumber || '');
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

  const handleSave = async () => {
    try {
      await handleSubmit();
      // Если форма валидна и нет ошибок, переходим назад
      if (isValid && !formError) {
        router.back();
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

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
    <FormScreen
      title="Изменение учетной записи"
      saveButtonText="Сохранить"
      onSave={handleSave}
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
      />

      <FormField
        label="Фамилия"
        value={lastName}
        onChangeText={updateLastName}
        placeholder="Введите фамилию"
        error={errors.lastName?.message}
      />

      <FormField
        label="Номер телефона"
        value={phoneNumber}
        onChangeText={updatePhoneNumber}
        placeholder="+7 (___) ___-__-__"
        error={errors.phoneNumber?.message}
        keyboardType="phone-pad"
        maskedInputProps={maskedInputProps}
      />
    </FormScreen>
  );
}
