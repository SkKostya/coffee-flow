import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfileContext } from '../../shared/contexts/ProfileContext';
import {
  EditAccountFormData,
  editAccountSchema,
} from '../validation/editAccountSchema';

interface UseEditAccountFormProps {
  initialFirstName?: string;
  initialLastName?: string;
  initialPhone?: string;
  onSubmit?: (
    data: EditAccountFormData
  ) => Promise<{ success: boolean; error?: string }>;
}

export const useEditAccountForm = ({
  initialFirstName = '',
  initialLastName = '',
  initialPhone = '',
  onSubmit,
}: UseEditAccountFormProps = {}) => {
  const { updateProfile } = useProfileContext();
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<EditAccountFormData>({
    resolver: zodResolver(editAccountSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      phoneNumber: initialPhone,
    },
  });

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const phoneNumber = watch('phoneNumber');

  const handleFormSubmit = async (data: EditAccountFormData) => {
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

      // Используем глобальное состояние для обновления профиля
      const result = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: '', // Email не используется в текущей форме
      });

      if (!result.success) {
        setFormError(result.error || 'Ошибка обновления профиля');
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = 'Произошла ошибка при сохранении данных';
      setFormError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFirstName = (text: string) => {
    setFormError('');
    setValue('firstName', text, { shouldValidate: true });
  };

  const updateLastName = (text: string) => {
    setFormError('');
    setValue('lastName', text, { shouldValidate: true });
  };

  const updatePhoneNumber = (text: string) => {
    setFormError('');
    setValue('phoneNumber', text, { shouldValidate: true });
  };

  const resetForm = () => {
    reset({
      firstName: initialFirstName,
      lastName: initialLastName,
      phoneNumber: initialPhone,
    });
    setFormError('');
  };

  const hasChanges = isDirty;

  return {
    control,
    firstName,
    lastName,
    phoneNumber,
    errors,
    isValid,
    isSubmitting,
    formError,
    hasChanges,
    setValue,
    updateFirstName,
    updateLastName,
    updatePhoneNumber,
    handleSubmit: handleSubmit(handleFormSubmit),
    reset: resetForm,
  };
};
