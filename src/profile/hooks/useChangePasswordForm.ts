import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
      newPassword: '',
      confirmPassword: '',
    },
  });

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

      console.log('Form submitted:', data);
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
      newPassword: '',
      confirmPassword: '',
    });
    setFormError('');
  };

  const hasChanges = isDirty;

  return {
    control,
    newPassword,
    confirmPassword,
    errors,
    isValid,
    isSubmitting,
    formError,
    hasChanges,
    setValue,
    updateNewPassword,
    updateConfirmPassword,
    handleSubmit: handleSubmit(handleFormSubmit),
    reset: resetForm,
  };
};
