import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile } from '../../store';
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from '../validation/changePasswordSchema';

export const useChangePasswordForm = () => {
  const { changePassword } = useProfile();
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const currentPassword = watch('currentPassword');
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  const handleFormSubmit = async (data: ChangePasswordFormData) => {
    try {
      setFormError('');
      setIsSubmitting(true);

      // Используем глобальное состояние для изменения пароля
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      router.back();
      return { success: true };
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = 'Произошла ошибка при изменении пароля';
      setFormError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCurrentPassword = (text: string) => {
    setFormError('');
    setValue('currentPassword', text, { shouldValidate: true });
  };

  const updateNewPassword = (text: string) => {
    setFormError('');
    setValue('newPassword', text, { shouldValidate: true });
  };

  const updateConfirmPassword = (text: string) => {
    setFormError('');
    setValue('confirmPassword', text, { shouldValidate: true });
  };

  const resetForm = () => {
    reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setFormError('');
  };

  return {
    control,
    currentPassword,
    newPassword,
    confirmPassword,
    errors,
    isValid: Object.keys(errors).length === 0,
    isSubmitting,
    formError,
    setValue,
    updateCurrentPassword,
    updateNewPassword,
    updateConfirmPassword,
    handleSubmit: handleSubmit(handleFormSubmit),
    reset: resetForm,
  };
};
