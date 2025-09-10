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
    updateCurrentPassword,
    updateNewPassword,
    updateConfirmPassword,
    handleSubmit,
  } = useChangePasswordForm();

  return (
    <FormScreen
      title="Изменение пароля"
      saveButtonText="Сохранить"
      onSave={handleSubmit}
      isValid={isValid}
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
        returnKeyType="next"
        autoCapitalize="none"
      />

      <FormField
        label="Введите новый пароль"
        value={newPassword}
        onChangeText={updateNewPassword}
        placeholder="Введите новый пароль"
        error={errors.newPassword?.message}
        secureTextEntry
        returnKeyType="next"
        autoCapitalize="none"
      />

      <FormField
        label="Повторите пароль"
        value={confirmPassword}
        onChangeText={updateConfirmPassword}
        placeholder="Повторите пароль"
        error={errors.confirmPassword?.message}
        secureTextEntry
        returnKeyType="done"
        autoCapitalize="none"
      />
    </FormScreen>
  );
}
