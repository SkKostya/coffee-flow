import { z } from 'zod';

export const authSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Введите номер телефона')
    .regex(/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/, 'Неверный формат номера')
    .transform((val) => val.replace(/\s/g, '')), // Убираем пробелы для API
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

export type AuthFormData = z.infer<typeof authSchema>;

// Сообщения об ошибках для UI
export const errorMessages = {
  phoneNumber: {
    required: 'Введите номер телефона',
    format: 'Неверный формат номера',
    example: 'Пример: +7 (771) 123-45-67',
  },
  password: {
    required: 'Введите пароль',
    minLength: 'Пароль должен содержать минимум 6 символов',
    maxLength: 'Пароль слишком длинный',
  },
} as const;
