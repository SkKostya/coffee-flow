# API Интеграция

## Обзор

Документация по интеграции фронтенда с бэкендом для модуля аутентификации.

## Структура API

### Базовый URL

API URL настраивается через переменную окружения `API_URL` в файле `.env`.

### Эндпоинты

#### Регистрация

- **URL**: `POST /clients/signup`
- **Body**:
  ```json
  {
    "phoneNumber": "+77001234567",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123"
  }
  ```

#### Авторизация

- **URL**: `POST /clients/signin`
- **Body**:
  ```json
  {
    "phoneNumber": "+77001234567",
    "password": "password123"
  }
  ```

## Архитектура

### API Сервисы

- `src/auth/services/authApi.ts` - Основной API клиент для аутентификации
- `src/auth/services/index.ts` - Экспорт API сервисов

### Хуки

- `useAuthForm` - Хук для формы авторизации
- `useRegistrationForm` - Хук для формы регистрации
- `useAuth` - Базовый хук для управления состоянием аутентификации

### Контекст

- `AuthContext` - Контекст для управления глобальным состоянием аутентификации
- `AuthProvider` - Провайдер контекста

### Типы

- `LoginCredentials` - Тип для данных авторизации
- `RegistrationCredentials` - Тип для данных регистрации
- `AuthResponse` - Тип ответа от API
- `User` - Тип пользователя

## Использование

### 1. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
API_URL=https://your-api-domain.com/api
```

### 2. Использование в компонентах

#### Форма авторизации

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
    // Ваш JSX
  );
};
```

#### Форма регистрации

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
    // Ваш JSX
  );
};
```

#### Использование контекста аутентификации

```typescript
import { useAuthContext } from '../src/auth/contexts';

const SomeComponent = () => {
  const { user, isAuthenticated, logout } = useAuthContext();

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

### 3. Прямое использование API

```typescript
import { authApi } from '../src/auth/services';

// Авторизация
const login = async () => {
  try {
    const response = await authApi.signin({
      phoneNumber: '+77001234567',
      password: 'password123',
    });

    if (response.success) {
      console.log('Успешная авторизация:', response);
    }
  } catch (error) {
    console.error('Ошибка авторизации:', error);
  }
};

// Регистрация
const register = async () => {
  try {
    const response = await authApi.signup({
      phoneNumber: '+77001234567',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    });

    if (response.success) {
      console.log('Успешная регистрация:', response);
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error);
  }
};
```

## Обработка ошибок

### Типы ошибок

1. **Валидационные ошибки** - обрабатываются на уровне форм
2. **Сетевые ошибки** - обрабатываются в API клиенте
3. **Ошибки сервера** - обрабатываются в API клиенте

### Пример обработки ошибок

```typescript
try {
  const response = await authApi.signin(credentials);
  // Обработка успешного ответа
} catch (error) {
  if (error instanceof Error) {
    // Обработка ошибки
    setError(error.message);
  }
}
```

## Состояние загрузки

Все API запросы поддерживают состояние загрузки:

- `isSubmitting` - состояние загрузки для форм
- `isLoading` - состояние загрузки для контекста

## Безопасность

### Хранение токенов

- Токены сохраняются в `AsyncStorage`
- Автоматическая очистка при выходе
- Проверка токена при инициализации приложения

### Валидация

- Валидация на клиенте с помощью Zod
- Валидация на сервере
- Защита от XSS и инъекций

## Тестирование

### Мокирование API

```typescript
// В тестах можно мокировать API
jest.mock('../src/auth/services/authApi', () => ({
  authApi: {
    signin: jest.fn(),
    signup: jest.fn(),
  },
}));
```

### Тестирование хуков

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useAuthForm } from '../src/auth/hooks';

test('should handle login form', () => {
  const { result } = renderHook(() => useAuthForm());

  expect(result.current.phoneNumber).toBe('');
  expect(result.current.password).toBe('');
});
```

## Расширение

### Добавление новых эндпоинтов

1. Добавьте новый метод в `authApi`
2. Создайте соответствующие типы
3. Обновите хуки при необходимости

### Добавление новых полей

1. Обновите схемы валидации
2. Обновите типы
3. Обновите компоненты форм

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

### Логирование

Для отладки включите логирование в API клиенте:

```typescript
// В authApi.ts
console.log('API Request:', { endpoint, data });
console.log('API Response:', response);
```
