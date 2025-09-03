import { z } from 'zod';

export const addCardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Введите номер карты')
    .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Неверный формат номера карты'),
  expiryDate: z
    .string()
    .min(1, 'Введите дату истечения')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Неверный формат даты (MM/YY)'),
  cvc: z
    .string()
    .min(1, 'Введите CVC/CVV')
    .regex(/^\d{3,4}$/, 'CVC/CVV должен содержать 3-4 цифры'),
});

export type AddCardFormData = z.infer<typeof addCardSchema>;

// Сообщения об ошибках для UI
export const addCardErrorMessages = {
  cardNumber: {
    required: 'Введите номер карты',
    format: 'Неверный формат номера карты',
    example: 'Пример: 1234 5678 9012 3456',
  },
  expiryDate: {
    required: 'Введите дату истечения',
    format: 'Неверный формат даты (MM/YY)',
    example: 'Пример: 12/25',
  },
  cvc: {
    required: 'Введите CVC/CVV',
    format: 'CVC/CVV должен содержать 3-4 цифры',
    example: 'Пример: 123',
  },
} as const;
