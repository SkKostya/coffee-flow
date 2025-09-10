import { z } from 'zod';

export const authSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Введите номер телефона')
    .regex(/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/, 'Неверный формат номера')
    .transform((val) => '+' + val.replace(/\D/g, '')), // Убираем пробелы для API
  password: z
    .string()
    .min(1, 'Введите пароль')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(50, 'Пароль слишком длинный')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ'
    ),
});

export const registrationSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Введите номер телефона')
    .regex(/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/, 'Неверный формат номера')
    .transform((val) => '+' + val.replace(/\D/g, '')), // Убираем пробелы для API
  firstName: z
    .string()
    .min(1, 'Введите имя')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя слишком длинное')
    .regex(
      /^[а-яёА-ЯЁa-zA-Z\s-]+$/,
      'Имя может содержать только буквы, пробелы и дефисы'
    ),
  lastName: z
    .string()
    .min(1, 'Введите фамилию')
    .min(2, 'Фамилия должна содержать минимум 2 символа')
    .max(50, 'Фамилия слишком длинная')
    .regex(
      /^[а-яёА-ЯЁa-zA-Z\s-]+$/,
      'Фамилия может содержать только буквы, пробелы и дефисы'
    ),
  password: z
    .string()
    .min(1, 'Введите пароль')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(50, 'Пароль слишком длинный')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ'
    ),
});

export const resetPasswordSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Введите номер телефона')
    .regex(/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/, 'Неверный формат номера')
    .transform((val) => '+' + val.replace(/\D/g, '')), // Убираем пробелы для API
});

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Введите новый пароль')
      .min(8, 'Пароль должен содержать минимум 8 символов')
      .max(50, 'Пароль слишком длинный')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ'
      ),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type AuthFormData = z.infer<typeof authSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

// Сообщения об ошибках для UI
export const errorMessages = {
  phoneNumber: {
    required: 'Введите номер телефона',
    format: 'Неверный формат номера',
    example: 'Пример: +7 (771) 123-45-67',
  },
  password: {
    required: 'Введите пароль',
    minLength: 'Пароль должен содержать минимум 8 символов',
    maxLength: 'Пароль слишком длинный',
  },
  firstName: {
    required: 'Введите имя',
    minLength: 'Имя должно содержать минимум 2 символа',
    maxLength: 'Имя слишком длинное',
    format: 'Имя может содержать только буквы, пробелы и дефисы',
  },
  lastName: {
    required: 'Введите фамилию',
    minLength: 'Фамилия должна содержать минимум 2 символа',
    maxLength: 'Фамилия слишком длинная',
    format: 'Фамилия может содержать только буквы, пробелы и дефисы',
  },
  confirmPassword: {
    required: 'Подтвердите пароль',
    mismatch: 'Пароли не совпадают',
  },
} as const;
