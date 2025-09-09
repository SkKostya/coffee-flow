import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfileContext } from '../../shared/contexts/ProfileContext';
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from '../validation/changePasswordSchema';

interface UseChangePasswordFormProps {
  onSubmit?: (
    data: ChangePasswordFormData
  ) => Promise<{ success: boolean; error?: string }>;
}

export const useChangePasswordForm = ({
  onSubmit,
}: UseChangePasswordFormProps = {}) => {
  const { changePassword } = useProfileContext();
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
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

      if (onSubmit) {
        const result = await onSubmit(data);
        if (!result.success && result.error) {
          setFormError(result.error);
        }
        return result;
      }

      // Используем глобальное состояние для изменения пароля
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (!result.success) {
        setFormError(result.error || 'Ошибка изменения пароля');
        return { success: false, error: result.error };
      }

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

  const hasChanges = isDirty;

  return {
    control,
    currentPassword,
    newPassword,
    confirmPassword,
    errors,
    isValid,
    isSubmitting,
    formError,
    hasChanges,
    setValue,
    updateCurrentPassword,
    updateNewPassword,
    updateConfirmPassword,
    handleSubmit: handleSubmit(handleFormSubmit),
    reset: resetForm,
  };
};
