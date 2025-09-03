import { z } from 'zod';

export const editAccountSchema = z.object({
  name: z
    .string()
    .min(1, 'Введите ваше имя')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя слишком длинное')
    .regex(
      /^[а-яА-ЯёЁa-zA-Z\s]+$/,
      'Имя может содержать только буквы и пробелы'
    ),
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
  name: {
    required: 'Введите ваше имя',
    minLength: 'Имя должно содержать минимум 2 символа',
    maxLength: 'Имя слишком длинное',
    format: 'Имя может содержать только буквы и пробелы',
  },
  phoneNumber: {
    required: 'Введите номер телефона',
    format: 'Неверный формат номера телефона',
    example: 'Пример: +7 (771) 123-45-67',
  },
} as const;
