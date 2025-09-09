import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoginCredentials } from '../../types/auth';
import { useAuthContext } from '../contexts/AuthContext';
import { authApi } from '../services/authApi';
import { AuthFormData, authSchema } from '../validation/validationSchema';

export const useAuthForm = () => {
  const [formError, setFormError] = useState<string>('');
  const { login } = useAuthContext();

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

  const onSubmitLogin = async (data: AuthFormData) => {
    try {
      setFormError('');

      const credentials: LoginCredentials = {
        phoneNumber: data.phoneNumber,
        password: data.password,
      };

      const response = await authApi.signin(credentials);
      console.log('response', response);

      if (response.accessToken) {
        await login(response);
        return { success: true, data: response };
      } else {
        const errorMessage = response.message || 'Ошибка авторизации';
        setFormError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при авторизации';
      setFormError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleLogin = handleSubmit(onSubmitLogin);

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
    reset,
  };
};
