import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthFormData, authSchema } from '../validation/validationSchema';

export const useAuthForm = () => {
  const [formError, setFormError] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: 'onChange',
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
  });

  const phoneNumber = watch('phoneNumber');
  const password = watch('password');

  const onSubmit = async (data: AuthFormData) => {
    try {
      setFormError('');
      console.log('Form submitted:', data);
      // Здесь будет логика отправки на сервер
      return { success: true };
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = 'Произошла ошибка при отправке';
      setFormError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleLogin = handleSubmit(onSubmit);
  const handleRegistration = handleSubmit(onSubmit);

  const updatePhoneNumber = (text: string) => {
    setFormError('');
    setValue('phoneNumber', text, { shouldValidate: true });
  };

  const updatePassword = (text: string) => {
    setFormError('');
    setValue('password', text, { shouldValidate: true });
  };

  return {
    control,
    phoneNumber,
    password,
    errors,
    isValid,
    isSubmitting,
    formError,
    setValue,
    updatePhoneNumber,
    updatePassword,
    handleLogin,
    handleRegistration,
    reset,
  };
};
