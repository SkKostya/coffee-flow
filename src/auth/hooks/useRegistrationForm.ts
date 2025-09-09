import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  RegistrationFormData,
  registrationSchema,
} from '../validation/validationSchema';

export const useRegistrationForm = () => {
  const [formError, setFormError] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      phoneNumber: '',
      firstName: '',
      lastName: '',
      password: '',
    },
  });

  const phoneNumber = watch('phoneNumber');
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const password = watch('password');

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setFormError('');
      console.log('Registration form submitted:', data);
      // Здесь будет логика отправки на сервер
      return { success: true };
    } catch (error) {
      console.error('Registration form submission error:', error);
      const errorMessage = 'Произошла ошибка при регистрации';
      setFormError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleRegistration = handleSubmit(onSubmit);

  const updatePhoneNumber = (text: string) => {
    setFormError('');
    setValue('phoneNumber', text, { shouldValidate: true });
  };

  const updateFirstName = (text: string) => {
    setFormError('');
    setValue('firstName', text, { shouldValidate: true });
  };

  const updateLastName = (text: string) => {
    setFormError('');
    setValue('lastName', text, { shouldValidate: true });
  };

  const updatePassword = (text: string) => {
    setFormError('');
    setValue('password', text, { shouldValidate: true });
  };

  return {
    control,
    phoneNumber,
    firstName,
    lastName,
    password,
    errors,
    isValid,
    isSubmitting,
    formError,
    setValue,
    updatePhoneNumber,
    updateFirstName,
    updateLastName,
    updatePassword,
    handleRegistration,
    reset,
  };
};
