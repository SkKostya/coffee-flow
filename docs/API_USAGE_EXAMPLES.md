# Примеры использования API

## Обзор

Этот документ содержит практические примеры использования API интеграции в проекте Coffee Flow.

## Быстрый старт

### 1. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
API_URL=https://your-api-domain.com/api
```

### 2. Использование в компонентах

#### Форма авторизации

```typescript
import React from 'react';
import { useAuthForm } from '../src/auth/hooks';

const LoginScreen = () => {
  const {
    phoneNumber,
    password,
    errors,
    isValid,
    isSubmitting,
    formError,
    updatePhoneNumber,
    updatePassword,
    handleLogin,
  } = useAuthForm();

  return (
    <View>
      <PhoneInput
        label="Номер телефона"
        value={phoneNumber}
        onChangeText={updatePhoneNumber}
        error={errors.phoneNumber?.message}
        isInvalid={!!errors.phoneNumber}
      />

      <PasswordInput
        label="Пароль"
        value={password}
        onChangeText={updatePassword}
        error={errors.password?.message}
        isInvalid={!!errors.password}
      />

      <Button
        title="Войти"
        onPress={handleLogin}
        disabled={!isValid || isSubmitting}
        loading={isSubmitting}
      />

      {formError && <FormError message={formError} />}
    </View>
  );
};
```

#### Форма регистрации

```typescript
import React from 'react';
import { useRegistrationForm } from '../src/auth/hooks';

const RegisterScreen = () => {
  const {
    phoneNumber,
    firstName,
    lastName,
    password,
    errors,
    isValid,
    isSubmitting,
    formError,
    updatePhoneNumber,
    updateFirstName,
    updateLastName,
    updatePassword,
    handleRegistration,
  } = useRegistrationForm();

  return (
    <View>
      <PhoneInput
        label="Номер телефона"
        value={phoneNumber}
        onChangeText={updatePhoneNumber}
        error={errors.phoneNumber?.message}
        isInvalid={!!errors.phoneNumber}
      />

      <InputField
        label="Имя"
        value={firstName}
        onChangeText={updateFirstName}
        error={errors.firstName?.message}
        isInvalid={!!errors.firstName}
      />

      <InputField
        label="Фамилия"
        value={lastName}
        onChangeText={updateLastName}
        error={errors.lastName?.message}
        isInvalid={!!errors.lastName}
      />

      <PasswordInput
        label="Пароль"
        value={password}
        onChangeText={updatePassword}
        error={errors.password?.message}
        isInvalid={!!errors.password}
      />

      <Button
        title="Зарегистрироваться"
        onPress={handleRegistration}
        disabled={!isValid || isSubmitting}
        loading={isSubmitting}
      />

      {formError && <FormError message={formError} />}
    </View>
  );
};
```

#### Использование контекста аутентификации

```typescript
import React from 'react';
import { useAuthContext } from '../src/auth/contexts';

const ProfileScreen = () => {
  const { user, isAuthenticated, logout } = useAuthContext();

  if (!isAuthenticated) {
    return <Text>Пожалуйста, войдите в систему</Text>;
  }

  return (
    <View>
      <Text>
        Добро пожаловать, {user?.firstName} {user?.lastName}!
      </Text>
      <Text>Телефон: {user?.phoneNumber}</Text>
      <Button title="Выйти" onPress={logout} />
    </View>
  );
};
```

#### Компонент состояния аутентификации

```typescript
import React from 'react';
import { AuthStatus } from '../src/auth/components';

const Header = () => {
  return (
    <View>
      <Text>Мое приложение</Text>
      <AuthStatus
        onLoginPress={() => router.navigate('/auth/login')}
        onLogoutPress={() => router.navigate('/')}
      />
    </View>
  );
};
```

### 3. Прямое использование API

#### Авторизация

```typescript
import { authApi } from '../src/auth/services';

const loginUser = async (phoneNumber: string, password: string) => {
  try {
    const response = await authApi.signin({
      phoneNumber,
      password,
    });

    if (response.success) {
      console.log('Успешная авторизация:', response);
      // Обработка успешной авторизации
    } else {
      console.error('Ошибка авторизации:', response.message);
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
  }
};
```

#### Регистрация

```typescript
import { authApi } from '../src/auth/services';

const registerUser = async (
  phoneNumber: string,
  firstName: string,
  lastName: string,
  password: string
) => {
  try {
    const response = await authApi.signup({
      phoneNumber,
      firstName,
      lastName,
      password,
    });

    if (response.success) {
      console.log('Успешная регистрация:', response);
      // Обработка успешной регистрации
    } else {
      console.error('Ошибка регистрации:', response.message);
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
  }
};
```

## Обработка ошибок

### Валидационные ошибки

```typescript
const { errors, formError } = useAuthForm();

// Ошибки полей
{
  errors.phoneNumber && (
    <Text style={styles.error}>{errors.phoneNumber.message}</Text>
  );
}

// Общая ошибка формы
{
  formError && <Text style={styles.error}>{formError}</Text>;
}
```

### Сетевые ошибки

```typescript
try {
  const response = await authApi.signin(credentials);
  // Обработка успешного ответа
} catch (error) {
  if (error instanceof Error) {
    // Обработка ошибки
    setError(error.message);
  } else {
    setError('Произошла неизвестная ошибка');
  }
}
```

## Состояние загрузки

### В формах

```typescript
const { isSubmitting } = useAuthForm();

<Button
  title="Войти"
  onPress={handleLogin}
  disabled={isSubmitting}
  loading={isSubmitting}
/>;
```

### В контексте

```typescript
const { isLoading } = useAuthContext();

if (isLoading) {
  return <ActivityIndicator />;
}
```

## Навигация после авторизации

### Условная навигация

```typescript
import { useAuthContext } from '../src/auth/contexts';

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <MainTabs />;
  }

  return <AuthStack />;
};
```

### Программная навигация

```typescript
import { router } from 'expo-router';

const handleLogin = async () => {
  try {
    const response = await authApi.signin(credentials);
    if (response.success) {
      await login(response);
      router.navigate('/dashboard');
    }
  } catch (error) {
    // Обработка ошибки
  }
};
```

## Тестирование

### Мокирование API

```typescript
// __mocks__/authApi.ts
export const authApi = {
  signin: jest.fn(),
  signup: jest.fn(),
};
```

### Тестирование хуков

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthForm } from '../src/auth/hooks';

test('should handle form submission', async () => {
  const { result } = renderHook(() => useAuthForm());

  act(() => {
    result.current.updatePhoneNumber('+77001234567');
    result.current.updatePassword('password123');
  });

  expect(result.current.phoneNumber).toBe('+77001234567');
  expect(result.current.password).toBe('password123');
});
```

### Тестирование контекста

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { AuthProvider, useAuthContext } from '../src/auth/contexts';

test('should provide auth context', () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  const { result } = renderHook(() => useAuthContext(), { wrapper });

  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.user).toBe(null);
});
```

## Расширение функциональности

### Добавление новых полей

```typescript
// 1. Обновите схему валидации
export const registrationSchema = z.object({
  // ... существующие поля
  email: z.string().email('Неверный формат email'),
});

// 2. Обновите типы
export interface RegistrationCredentials {
  // ... существующие поля
  email: string;
}

// 3. Обновите хук
const updateEmail = (text: string) => {
  setFormError('');
  setValue('email', text, { shouldValidate: true });
};
```

### Добавление новых эндпоинтов

```typescript
// В authApi.ts
export const authApi = {
  // ... существующие методы
  async resetPassword(phoneNumber: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        '/clients/reset-password',
        { phoneNumber }
      );
      return response;
    } catch (error) {
      console.error('Ошибка сброса пароля:', error);
      throw error;
    }
  },
};
```

## Troubleshooting

### Частые проблемы

1. **Ошибка "API_URL не найден"**

   - Проверьте наличие переменной `API_URL` в `.env`
   - Убедитесь, что файл `.env` находится в корне проекта

2. **Ошибки валидации**

   - Проверьте соответствие данных схеме валидации
   - Убедитесь, что все обязательные поля заполнены

3. **Проблемы с токенами**

   - Проверьте правильность сохранения токена
   - Убедитесь, что токен передается в заголовках запросов

4. **Ошибки сети**
   - Проверьте доступность API сервера
   - Убедитесь, что URL корректный

### Логирование

Для отладки включите логирование:

```typescript
// В authApi.ts
console.log('API Request:', { endpoint, data });
console.log('API Response:', response);
```

### Проверка состояния

```typescript
const { user, isAuthenticated, isLoading } = useAuthContext();

console.log('Auth State:', {
  user,
  isAuthenticated,
  isLoading,
});
```
