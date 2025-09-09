import { router } from 'expo-router';
import React from 'react';
import { useChangePasswordForm } from '../src/profile';
import FormField from '../src/shared/components/FormField';
import FormScreen from '../src/shared/components/FormScreen';

export default function ChangePasswordScreen() {
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    errors,
    isValid,
    isSubmitting,
    formError,
    hasChanges,
    updateCurrentPassword,
    updateNewPassword,
    updateConfirmPassword,
    handleSubmit,
  } = useChangePasswordForm({
    onSubmit: async (data) => {
      // TODO: Реализовать изменение пароля на сервере
      console.log('Changing password:', data);
      return { success: true };
    },
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
      title="Изменение пароля"
      saveButtonText="Сохранить"
      onSave={handleSave}
      isValid={isValid}
      hasChanges={hasChanges}
      isSubmitting={isSubmitting}
      formError={formError}
    >
      <FormField
        label="Текущий пароль"
        value={currentPassword}
        onChangeText={updateCurrentPassword}
        placeholder="Введите текущий пароль"
        error={errors.currentPassword?.message}
        secureTextEntry
        autoCapitalize="none"
      />

      <FormField
        label="Введите новый пароль"
        value={newPassword}
        onChangeText={updateNewPassword}
        placeholder="Введите новый пароль"
        error={errors.newPassword?.message}
        secureTextEntry
        autoCapitalize="none"
      />

      <FormField
        label="Повторите пароль"
        value={confirmPassword}
        onChangeText={updateConfirmPassword}
        placeholder="Повторите пароль"
        error={errors.confirmPassword?.message}
        secureTextEntry
        autoCapitalize="none"
      />
    </FormScreen>
  );
}
