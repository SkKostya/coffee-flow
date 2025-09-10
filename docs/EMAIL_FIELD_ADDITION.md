# Добавление поля редактирования email адреса

## Задача

Добавить поле для редактирования email адреса в форму редактирования профиля пользователя.

## Реализация

### 1. **Обновление схемы валидации**

```typescript
// src/profile/validation/editAccountSchema.ts
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
  email: z
    .string()
    .min(1, 'Введите email адрес')
    .email('Неверный формат email адреса')
    .max(100, 'Email слишком длинный'),
  phoneNumber: z
    .string()
    .min(1, 'Введите номер телефона')
    .regex(
      /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/,
      'Неверный формат номера телефона'
    )
    .transform((val) => val.replace(/\s/g, '')),
});
```

### 2. **Обновление сообщений об ошибках**

```typescript
// src/profile/validation/editAccountSchema.ts
export const editAccountErrorMessages = {
  // ... другие поля
  email: {
    required: 'Введите email адрес',
    format: 'Неверный формат email адреса',
    maxLength: 'Email слишком длинный',
    example: 'Пример: user@example.com',
  },
  // ... другие поля
} as const;
```

### 3. **Обновление хука useEditAccountForm**

```typescript
// src/profile/hooks/useEditAccountForm.ts
interface UseEditAccountFormProps {
  initialFirstName?: string;
  initialLastName?: string;
  initialEmail?: string; // Добавлено
  initialPhone?: string;
  // ...
}

export const useEditAccountForm = ({
  initialFirstName = '',
  initialLastName = '',
  initialEmail = '', // Добавлено
  initialPhone = '',
}: // ...
UseEditAccountFormProps = {}) => {
  // ...

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const email = watch('email'); // Добавлено
  const phoneNumber = watch('phoneNumber');

  // Добавлена функция обновления email
  const updateEmail = (text: string) => {
    setFormError('');
    setValue('email', text, { shouldValidate: true });
  };

  // Обновлен handleFormSubmit для отправки email
  const handleFormSubmit = async (data: EditAccountFormData) => {
    // ...
    const result = await updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email, // Теперь отправляется email
    });
    // ...
  };

  return {
    // ...
    email, // Добавлено
    updateEmail, // Добавлено
    // ...
  };
};
```

### 4. **Обновление UI компонента**

```typescript
// app/edit-account.tsx
export default function EditAccountScreen() {
  const {
    firstName,
    lastName,
    email, // Добавлено
    phoneNumber,
    // ...
    updateEmail, // Добавлено
    // ...
  } = useEditAccountForm({
    initialFirstName: '',
    initialLastName: '',
    initialEmail: '', // Добавлено
    initialPhone: '',
    // ...
  });

  // Обновление формы при загрузке данных профиля
  useEffect(() => {
    if (profile && !isLoading) {
      setValue('firstName', profile.firstName || '');
      setValue('lastName', profile.lastName || '');
      setValue('email', profile.email || ''); // Добавлено
      setValue('phoneNumber', profile.phoneNumber || '');
    }
  }, [profile, isLoading, setValue]);

  return (
    <FormScreen>
      {/* ... другие поля */}

      <FormField
        label="Email адрес"
        value={email}
        onChangeText={updateEmail}
        placeholder="Введите email адрес"
        error={errors.email?.message}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* ... другие поля */}
    </FormScreen>
  );
}
```

## Особенности реализации

### ✅ **Валидация email**

- **Обязательное поле** - пользователь должен ввести email
- **Формат email** - проверяется корректность формата
- **Длина** - максимум 100 символов
- **Сообщения об ошибках** - понятные сообщения на русском языке

### ✅ **UI/UX улучшения**

- **Клавиатура** - `keyboardType="email-address"` для удобного ввода
- **Автокапитализация** - `autoCapitalize="none"` для email
- **Плейсхолдер** - подсказка "Введите email адрес"
- **Ошибки** - показываются под полем

### ✅ **Интеграция с API**

- **Отправка данных** - email отправляется на сервер при сохранении
- **Автозаполнение** - поле заполняется данными из профиля
- **Валидация** - проверяется перед отправкой

### ✅ **Типизация**

- **TypeScript** - полная типизация всех изменений
- **Zod схема** - валидация на уровне схемы
- **Интерфейсы** - обновлены все необходимые интерфейсы

## Структура полей формы

Теперь форма редактирования профиля содержит:

1. **Имя** - обязательное, только буквы, 2-50 символов
2. **Фамилия** - обязательное, только буквы, 2-50 символов
3. **Email адрес** - обязательное, валидный email, до 100 символов
4. **Номер телефона** - обязательное, формат +7 (**_) _**-**-**

## Проверка работы

1. **Откройте форму редактирования профиля**
2. **Проверьте автозаполнение** - email должен подставиться из профиля
3. **Попробуйте ввести невалидный email** - должна появиться ошибка
4. **Введите валидный email** - ошибка должна исчезнуть
5. **Сохраните форму** - email должен отправиться на сервер

## Примеры валидации

### ✅ **Валидные email адреса:**

- `user@example.com`
- `test.email@domain.co.uk`
- `user+tag@example.org`

### ❌ **Невалидные email адреса:**

- `invalid-email` (нет @)
- `@example.com` (нет локальной части)
- `user@` (нет домена)
- `user@.com` (точка в начале домена)

## Заключение

Поле email адреса успешно добавлено в форму редактирования профиля. Теперь пользователи могут:

- ✅ Редактировать свой email адрес
- ✅ Видеть валидацию в реальном времени
- ✅ Получать понятные сообщения об ошибках
- ✅ Использовать удобную клавиатуру для ввода email
- ✅ Автоматически заполнять поле данными из профиля

Форма стала более полной и функциональной! 🎉
