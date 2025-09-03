import { router } from 'expo-router';
import React from 'react';
import { useMaskedInputProps } from 'react-native-mask-input';
import { useEditAccountForm } from '../src/profile';
import FormField from '../src/shared/components/FormField';
import FormScreen from '../src/shared/components/FormScreen';

export default function EditAccountScreen() {
  const {
    name,
    phoneNumber,
    errors,
    isValid,
    isSubmitting,
    formError,
    hasChanges,
    updateName,
    updatePhoneNumber,
    handleSubmit,
  } = useEditAccountForm({
    initialName: 'Аружан',
    initialPhone: '+7 (777) 777-77-77',
    onSubmit: async (data) => {
      // TODO: Реализовать сохранение данных на сервер
      console.log('Saving account data:', data);
      return { success: true };
    },
  });

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
        label="Ваше имя"
        value={name}
        onChangeText={updateName}
        placeholder="Введите ваше имя"
        error={errors.name?.message}
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
