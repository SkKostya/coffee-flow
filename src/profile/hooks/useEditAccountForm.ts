import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  EditAccountFormData,
  editAccountSchema,
} from '../validation/editAccountSchema';

interface UseEditAccountFormProps {
  initialName?: string;
  initialPhone?: string;
  onSubmit?: (
    data: EditAccountFormData
  ) => Promise<{ success: boolean; error?: string }>;
}

export const useEditAccountForm = ({
  initialName = '',
  initialPhone = '',
  onSubmit,
}: UseEditAccountFormProps = {}) => {
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
      name: initialName,
      phoneNumber: initialPhone,
    },
  });

  const name = watch('name');
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

      console.log('Form submitted:', data);
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

  const updateName = (text: string) => {
    setFormError('');
    setValue('name', text, { shouldValidate: true });
  };

  const updatePhoneNumber = (text: string) => {
    setFormError('');
    setValue('phoneNumber', text, { shouldValidate: true });
  };

  const resetForm = () => {
    reset({
      name: initialName,
      phoneNumber: initialPhone,
    });
    setFormError('');
  };

  const hasChanges = isDirty;

  return {
    control,
    name,
    phoneNumber,
    errors,
    isValid,
    isSubmitting,
    formError,
    hasChanges,
    setValue,
    updateName,
    updatePhoneNumber,
    handleSubmit: handleSubmit(handleFormSubmit),
    reset: resetForm,
  };
};
