import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RegistrationCredentials } from '../../types/auth';
import { useAuthContext } from '../contexts/AuthContext';
import { authApi } from '../services/authApi';
import {
  RegistrationFormData,
  registrationSchema,
} from '../validation/validationSchema';

export const useRegistrationForm = () => {
  const [formError, setFormError] = useState<string>('');
  const { login } = useAuthContext();

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

  const onSubmitRegistration = async (data: RegistrationFormData) => {
    try {
      setFormError('');

      const credentials: RegistrationCredentials = {
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      };

      const response = await authApi.signup(credentials);

      if (response.success && response.token) {
        await login(response);
        return { success: true, data: response };
      } else {
        const errorMessage = response.message || 'Ошибка регистрации';
        setFormError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при регистрации';
      setFormError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleRegistration = handleSubmit(onSubmitRegistration);

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
