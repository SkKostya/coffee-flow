import { z } from 'zod';

export const editAccountSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Введите имя')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя слишком длинное')
    .regex(/^[а-яА-ЯёЁa-zA-Z]+$/, 'Имя может содержать только буквы'),
  lastName: z
    .string()
    .min(1, 'Введите фамилию')
    .min(2, 'Фамилия должна содержать минимум 2 символа')
    .max(50, 'Фамилия слишком длинная')
    .regex(/^[а-яА-ЯёЁa-zA-Z]+$/, 'Фамилия может содержать только буквы'),
  phoneNumber: z
    .string()
    .min(1, 'Введите номер телефона')
    .regex(
      /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/,
      'Неверный формат номера телефона'
    )
    .transform((val) => val.replace(/\s/g, '')), // Убираем пробелы для API
});

export type EditAccountFormData = z.infer<typeof editAccountSchema>;

// Сообщения об ошибках для UI
export const editAccountErrorMessages = {
  firstName: {
    required: 'Введите имя',
    minLength: 'Имя должно содержать минимум 2 символа',
    maxLength: 'Имя слишком длинное',
    format: 'Имя может содержать только буквы',
  },
  lastName: {
    required: 'Введите фамилию',
    minLength: 'Фамилия должна содержать минимум 2 символа',
    maxLength: 'Фамилия слишком длинная',
    format: 'Фамилия может содержать только буквы',
  },
  phoneNumber: {
    required: 'Введите номер телефона',
    format: 'Неверный формат номера телефона',
    example: 'Пример: +7 (771) 123-45-67',
  },
} as const;
