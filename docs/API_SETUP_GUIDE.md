# Руководство по настройке API

## Обзор

Этот документ содержит пошаговые инструкции по настройке и использованию API интеграции в проекте Coffee Flow.

## Шаг 1: Настройка переменных окружения

### Создание файла .env

Создайте файл `.env` в корне проекта:

```env
API_URL=https://your-api-domain.com/api
```

### Проверка настройки

Убедитесь, что переменная `API_URL` правильно загружается:

```typescript
import Constants from 'expo-constants';

console.log('API URL:', Constants.expoConfig?.extra?.API_URL);
```

## Шаг 2: Установка зависимостей

### Основные зависимости

```bash
pnpm add @react-native-async-storage/async-storage
```

### Проверка установки

```bash
pnpm list @react-native-async-storage/async-storage
```

## Шаг 3: Настройка провайдеров

### Обновление корневого layout

```typescript
// app/_layout.tsx
import { AuthProvider } from '../src/auth/contexts';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider>
          <CoffeeFlowThemeProvider>
            <AuthProvider>
              <LayoutStack />
            </AuthProvider>
          </CoffeeFlowThemeProvider>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
```

## Шаг 4: Использование в компонентах

### Форма авторизации

```typescript
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

### Форма регистрации

```typescript
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

## Шаг 5: Использование контекста аутентификации

### Проверка состояния аутентификации

```typescript
import { useAuthContext } from '../src/auth/contexts';

const SomeComponent = () => {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View>
      <Text>Добро пожаловать, {user?.firstName}!</Text>
      <Button title="Выйти" onPress={logout} />
    </View>
  );
};
```

### Компонент состояния аутентификации

```typescript
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

## Шаг 6: Прямое использование API

### Авторизация

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

### Регистрация

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

## Шаг 7: Обработка ошибок

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

## Шаг 8: Тестирование

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

## Шаг 9: Расширение функциональности

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

## Заключение

Теперь у вас есть полностью настроенная API интеграция для аутентификации в проекте Coffee Flow. Вы можете использовать формы авторизации и регистрации, управлять состоянием пользователя и обрабатывать ошибки.

Для получения дополнительной информации обратитесь к:

- [API интеграция](./API_INTEGRATION.md)
- [Примеры использования](./API_USAGE_EXAMPLES.md)
- [Документация проекта](../README.md)
