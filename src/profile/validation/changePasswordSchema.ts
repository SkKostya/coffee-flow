import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Введите текущий пароль'),
    newPassword: z
      .string()
      .min(1, 'Введите новый пароль')
      .min(8, 'Пароль должен содержать минимум 8 символов')
      .max(50, 'Пароль слишком длинный')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ'
      ),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Сообщения об ошибках для UI
export const changePasswordErrorMessages = {
  currentPassword: {
    required: 'Введите текущий пароль',
  },
  newPassword: {
    required: 'Введите новый пароль',
    minLength: 'Пароль должен содержать минимум 8 символов',
    maxLength: 'Пароль слишком длинный',
    format:
      'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ',
  },
  confirmPassword: {
    required: 'Повторите пароль',
    mismatch: 'Пароли не совпадают',
  },
} as const;
