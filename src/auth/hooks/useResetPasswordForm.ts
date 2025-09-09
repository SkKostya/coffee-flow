import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  NewPasswordFormData,
  ResetPasswordFormData,
  newPasswordSchema,
  resetPasswordSchema,
} from '../validation/validationSchema';

export const useResetPasswordForm = () => {
  const [formError, setFormError] = useState<string>('');
  const [step, setStep] = useState<'phone' | 'password'>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // Форма для ввода номера телефона
  const phoneForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      phoneNumber: '',
    },
  });

  // Форма для ввода нового пароля
  const passwordForm = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const phoneNumberValue = phoneForm.watch('phoneNumber');
  const password = passwordForm.watch('password');
  const confirmPassword = passwordForm.watch('confirmPassword');

  const onSubmitPhone = async (data: ResetPasswordFormData) => {
    try {
      setFormError('');
      console.log('Reset password phone submitted:', data);
      setPhoneNumber(data.phoneNumber);
      setStep('password');
      return { success: true };
    } catch (error) {
      console.error('Reset password phone submission error:', error);
      const errorMessage = 'Произошла ошибка при отправке кода';
      setFormError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const onSubmitPassword = async (data: NewPasswordFormData) => {
    try {
      setFormError('');
      console.log('New password submitted:', { phoneNumber, ...data });
      // Здесь будет логика отправки нового пароля на сервер
      return { success: true };
    } catch (error) {
      console.error('New password submission error:', error);
      const errorMessage = 'Произошла ошибка при смене пароля';
      setFormError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handlePhoneSubmit = phoneForm.handleSubmit(onSubmitPhone);
  const handlePasswordSubmit = passwordForm.handleSubmit(onSubmitPassword);

  const updatePhoneNumber = (text: string) => {
    setFormError('');
    phoneForm.setValue('phoneNumber', text, { shouldValidate: true });
  };

  const updatePassword = (text: string) => {
    setFormError('');
    passwordForm.setValue('password', text, { shouldValidate: true });
  };

  const updateConfirmPassword = (text: string) => {
    setFormError('');
    passwordForm.setValue('confirmPassword', text, { shouldValidate: true });
  };

  const goBackToPhone = () => {
    setStep('phone');
    setFormError('');
    passwordForm.reset();
  };

  const reset = () => {
    setStep('phone');
    setPhoneNumber('');
    setFormError('');
    phoneForm.reset();
    passwordForm.reset();
  };

  return {
    // Состояние
    step,
    phoneNumber,
    formError,

    // Форма телефона
    phoneForm: {
      control: phoneForm.control,
      phoneNumber: phoneNumberValue,
      errors: phoneForm.formState.errors,
      isValid: phoneForm.formState.isValid,
      isSubmitting: phoneForm.formState.isSubmitting,
      updatePhoneNumber,
      handleSubmit: handlePhoneSubmit,
    },

    // Форма пароля
    passwordForm: {
      control: passwordForm.control,
      password,
      confirmPassword,
      errors: passwordForm.formState.errors,
      isValid: passwordForm.formState.isValid,
      isSubmitting: passwordForm.formState.isSubmitting,
      updatePassword,
      updateConfirmPassword,
      handleSubmit: handlePasswordSubmit,
    },

    // Действия
    goBackToPhone,
    reset,
  };
};
