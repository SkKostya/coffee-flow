# Обновление форм профиля

## Обзор

Обновлены страницы изменения пароля и редактирования профиля согласно новым требованиям.

## Изменения

### 1. **Страница изменения пароля (`change-password.tsx`)**

#### Добавлено поле для текущего пароля:

```typescript
<FormField
  label="Текущий пароль"
  value={currentPassword}
  onChangeText={updateCurrentPassword}
  placeholder="Введите текущий пароль"
  error={errors.currentPassword?.message}
  secureTextEntry
  autoCapitalize="none"
/>
```

#### Обновлен хук `useChangePasswordForm`:

- Добавлено поле `currentPassword`
- Обновлены методы `updateCurrentPassword`
- Изменена схема валидации
- Обновлен API вызов для передачи текущего пароля

### 2. **Страница редактирования профиля (`edit-account.tsx`)**

#### Разделено поле "Ваше имя" на два поля:

```typescript
<FormField
  label="Имя"
  value={firstName}
  onChangeText={updateFirstName}
  placeholder="Введите имя"
  error={errors.firstName?.message}
/>

<FormField
  label="Фамилия"
  value={lastName}
  onChangeText={updateLastName}
  placeholder="Введите фамилию"
  error={errors.lastName?.message}
/>
```

#### Добавлена интеграция с API профиля:

```typescript
const { profile } = useProfile();

const {
  firstName,
  lastName,
  phoneNumber,
  // ...
} = useEditAccountForm({
  initialFirstName: profile?.firstName || '',
  initialLastName: profile?.lastName || '',
  initialPhone: profile?.phoneNumber || '',
  // ...
});
```

#### Обновлен хук `useEditAccountForm`:

- Заменено поле `name` на `firstName` и `lastName`
- Добавлены методы `updateFirstName` и `updateLastName`
- Обновлена схема валидации
- Изменен API вызов для передачи отдельных полей

### 3. **Схемы валидации**

#### `changePasswordSchema.ts`:

```typescript
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
```

#### `editAccountSchema.ts`:

```typescript
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
    .transform((val) => val.replace(/\s/g, '')),
});
```

## API интеграция

### Изменение пароля:

```typescript
const response = await profileApi.changePassword({
  currentPassword: data.currentPassword, // Теперь передается реальный пароль
  newPassword: data.newPassword,
  confirmPassword: data.confirmPassword,
});
```

### Обновление профиля:

```typescript
const response = await profileApi.updateProfile({
  firstName: data.firstName, // Отдельные поля
  lastName: data.lastName,
  email: '', // Email не используется в форме
});
```

## Валидация

### Поля формы изменения пароля:

1. **Текущий пароль** - обязательное поле
2. **Новый пароль** - минимум 8 символов, заглавная буква, цифра, специальный символ
3. **Подтверждение пароля** - должно совпадать с новым паролем

### Поля формы редактирования профиля:

1. **Имя** - минимум 2 символа, только буквы
2. **Фамилия** - минимум 2 символа, только буквы
3. **Номер телефона** - формат +7 (XXX) XXX-XX-XX

## Автозаполнение данных

Страница редактирования профиля теперь автоматически заполняется данными пользователя:

- Имя и фамилия берутся из `profile.firstName` и `profile.lastName`
- Номер телефона берется из `profile.phoneNumber`
- Если данные не загружены, поля остаются пустыми

## Преимущества

1. **Безопасность** - запрос текущего пароля при изменении
2. **Удобство** - разделение имени и фамилии для лучшего UX
3. **Автозаполнение** - данные пользователя загружаются автоматически
4. **Валидация** - строгая проверка всех полей
5. **API интеграция** - реальные запросы к серверу

## Тестирование

### Изменение пароля:

1. Откройте страницу изменения пароля
2. Заполните все три поля
3. Проверьте валидацию
4. Отправьте форму

### Редактирование профиля:

1. Откройте страницу редактирования профиля
2. Проверьте автозаполнение данных
3. Измените имя и фамилию
4. Проверьте валидацию
5. Отправьте форму

## Следующие шаги

1. **Тестирование с реальным API** - убедиться, что все запросы работают
2. **Обработка ошибок** - добавить специфичные сообщения для разных ошибок API
3. **Уведомления** - показывать успешные операции пользователю
4. **Оптимизация** - добавить debounce для полей ввода
