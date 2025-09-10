import { formatPhoneNumber } from '@/src/shared/helpers/specific-tools';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfile } from '../../store';
import {
  EditAccountFormData,
  editAccountSchema,
} from '../validation/editAccountSchema';

interface UseEditAccountFormProps {
  initialFirstName?: string;
  initialLastName?: string;
  initialEmail?: string;
  initialPhone?: string;
}

export const useEditAccountForm = ({
  initialFirstName = '',
  initialLastName = '',
  initialEmail = '',
  initialPhone = '',
}: UseEditAccountFormProps = {}) => {
  const { updateProfile } = useProfile();
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    reset,
  } = useForm<EditAccountFormData>({
    resolver: zodResolver(editAccountSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      email: initialEmail,
      phoneNumber: initialPhone,
    },
  });

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const email = watch('email');
  const phoneNumber = watch('phoneNumber');

  const hasChanges = useMemo(() => {
    return (
      firstName !== initialFirstName ||
      lastName !== initialLastName ||
      email !== initialEmail ||
      phoneNumber !== initialPhone
    );
  }, [
    firstName,
    lastName,
    email,
    phoneNumber,
    initialFirstName,
    initialLastName,
    initialEmail,
    initialPhone,
  ]);

  const handleFormSubmit = async () => {
    const data = getValues();
    try {
      setFormError('');
      setIsSubmitting(true);

      // Используем глобальное состояние для обновления профиля
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || '',
      });

      router.back();
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

  const updateEmail = (text: string) => {
    setFormError('');
    setValue('email', text, { shouldValidate: true });
  };

  const updatePhoneNumber = (text: string) => {
    setFormError('');
    setValue('phoneNumber', text, { shouldValidate: true });
  };

  const resetForm = () => {
    reset({
      firstName: initialFirstName,
      lastName: initialLastName,
      email: initialEmail,
      phoneNumber: formatPhoneNumber(initialPhone),
    });
    setFormError('');
  };

  return {
    control,
    firstName,
    lastName,
    email,
    phoneNumber,
    errors,
    isValid: Object.keys(errors).length === 0,
    isSubmitting,
    formError,
    hasChanges,
    setValue,
    updateFirstName,
    updateLastName,
    updateEmail,
    updatePhoneNumber,
    handleSubmit: handleSubmit(handleFormSubmit),
    reset: resetForm,
  };
};
