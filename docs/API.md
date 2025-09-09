# API и интеграция

## Обзор

Правила работы с API и интеграцией с бэкендом в проекте Coffee Flow.

## 🎯 Основные принципы

### 1. Типизация API запросов

**ОБЯЗАТЕЛЬНО** создавайте типы для всех API запросов:

```typescript
// ✅ Правильно
interface LoginRequest {
  phoneNumber: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

// ❌ Неправильно
const login = async (data: any) => {
  // Без типизации
};
```

### 2. Обработка ошибок

**ОБЯЗАТЕЛЬНО** обрабатывайте ошибки и показывайте их пользователю:

```typescript
// ✅ Правильно
try {
  const response = await authApi.signin(credentials);
  if (response.success) {
    // Обработка успеха
  } else {
    setError(response.message || 'Ошибка авторизации');
  }
} catch (error) {
  const errorMessage =
    error instanceof Error ? error.message : 'Произошла ошибка';
  setError(errorMessage);
}

// ❌ Неправильно
const response = await authApi.signin(credentials);
// Без обработки ошибок
```

### 3. Индикаторы загрузки

**ОБЯЗАТЕЛЬНО** показывайте индикаторы загрузки для всех запросов:

```typescript
// ✅ Правильно
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    const response = await api.post(data);
    // Обработка ответа
  } finally {
    setIsLoading(false);
  }
};

<Button
  title="Отправить"
  onPress={handleSubmit}
  loading={isLoading}
  disabled={isLoading}
/>;
```

### 4. Обработка пустых состояний

**ОБЯЗАТЕЛЬНО** обрабатывайте пустые кейсы:

```typescript
// ✅ Правильно
if (isLoading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage message={error} />;
}

if (data.length === 0) {
  return <EmptyState message="Данные не найдены" />;
}

return <DataList data={data} />;
```

## 🏗️ Архитектура API

### Структура модулей

```
src/
├── auth/
│   ├── services/
│   │   ├── authApi.ts      # API клиент для аутентификации
│   │   └── index.ts        # Экспорт сервисов
│   ├── hooks/
│   │   ├── useAuthForm.ts  # Хук для формы авторизации
│   │   └── useRegistrationForm.ts # Хук для формы регистрации
│   └── contexts/
│       └── AuthContext.tsx # Контекст аутентификации
├── coffee-shops/
│   ├── services/
│   │   ├── coffeeShopsApi.ts # API клиент для кофеен
│   │   └── index.ts
│   └── hooks/
│       └── useCoffeeShops.ts # Хук для работы с кофейнями
└── shared/
    ├── services/
    │   ├── ApiClient.ts    # Базовый API клиент
    │   └── index.ts
    └── hooks/
        └── useApi.ts       # Базовый хук для API
```

### Базовый API клиент

```typescript
// src/shared/services/ApiClient.ts
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Произошла неизвестная ошибка при выполнении запроса');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
```

## 🔧 Создание API сервисов

### 1. Создание типов

```typescript
// src/types/auth.ts
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface User {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Создание API сервиса

```typescript
// src/auth/services/authApi.ts
import { ApiClient } from '../../shared/services/ApiClient';
import {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
} from '../../types/auth';

const apiClient = new ApiClient(API_URL);

export const authApi = {
  async signin(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/clients/signin',
        credentials
      );
      return response;
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      throw error;
    }
  },

  async signup(credentials: RegistrationRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/clients/signup',
        credentials
      );
      return response;
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    }
  },
};
```

### 3. Создание хука

```typescript
// src/auth/hooks/useAuthForm.ts
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '../services/authApi';
import { useAuthContext } from '../contexts/AuthContext';

export const useAuthForm = () => {
  const [formError, setFormError] = useState<string>('');
  const { login } = useAuthContext();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      phoneNumber: '',
      password: '',
    },
  });

  const phoneNumber = watch('phoneNumber');
  const password = watch('password');

  const onSubmitLogin = async (data: LoginRequest) => {
    try {
      setFormError('');

      const response = await authApi.signin(data);

      if (response.success && response.token) {
        await login(response);
        return { success: true, data: response };
      } else {
        const errorMessage = response.message || 'Ошибка авторизации';
        setFormError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при авторизации';
      setFormError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const handleLogin = handleSubmit(onSubmitLogin);

  const updatePhoneNumber = (text: string) => {
    setFormError('');
    setValue('phoneNumber', text, { shouldValidate: true });
  };

  const updatePassword = (text: string) => {
    setFormError('');
    setValue('password', text, { shouldValidate: true });
  };

  return {
    control,
    phoneNumber,
    password,
    errors,
    isValid,
    isSubmitting,
    formError,
    setValue,
    updatePhoneNumber,
    updatePassword,
    handleLogin,
    reset,
  };
};
```

## 🎨 Использование в компонентах

### Форма авторизации

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

### Использование контекста

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
      <Text>Добро пожаловать, {user?.firstName}!</Text>
      <Button title="Выйти" onPress={logout} />
    </View>
  );
};
```

## 🔒 Безопасность

### Хранение токенов

```typescript
// Используйте AsyncStorage для хранения токенов
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@coffee_flow_token';

export const tokenStorage = {
  async save(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Ошибка сохранения токена:', error);
    }
  },

  async get(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Ошибка получения токена:', error);
      return null;
    }
  },

  async remove(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Ошибка удаления токена:', error);
    }
  },
};
```

### Передача токенов в запросах

```typescript
// Добавляйте токен в заголовки запросов
const apiClient = new ApiClient(API_URL);

apiClient.setAuthToken = (token: string) => {
  apiClient.defaultHeaders.Authorization = `Bearer ${token}`;
};
```

## 🧪 Тестирование

### Мокирование API

```typescript
// __mocks__/authApi.ts
export const authApi = {
  signin: jest.fn(),
  signup: jest.fn(),
};

// В тестах
jest.mock('../src/auth/services/authApi', () => ({
  authApi: {
    signin: jest.fn().mockResolvedValue({
      success: true,
      token: 'mock-token',
      user: { id: '1', phoneNumber: '+77001234567' },
    }),
    signup: jest.fn().mockResolvedValue({
      success: true,
      token: 'mock-token',
      user: { id: '1', phoneNumber: '+77001234567' },
    }),
  },
}));
```

### Тестирование хуков

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthForm } from '../src/auth/hooks';

test('should handle login form submission', async () => {
  const { result } = renderHook(() => useAuthForm());

  act(() => {
    result.current.updatePhoneNumber('+77001234567');
    result.current.updatePassword('password123');
  });

  expect(result.current.phoneNumber).toBe('+77001234567');
  expect(result.current.password).toBe('password123');

  await act(async () => {
    const response = await result.current.handleLogin();
    expect(response.success).toBe(true);
  });
});
```

## 📱 Адаптивность

### Обработка ошибок сети

```typescript
const handleApiError = (error: Error) => {
  if (error.message.includes('Network')) {
    return 'Проблемы с интернет-соединением';
  }

  if (error.message.includes('timeout')) {
    return 'Превышено время ожидания';
  }

  return 'Произошла ошибка при загрузке данных';
};
```

### Офлайн режим

```typescript
import NetInfo from '@react-native-community/netinfo';

const useOfflineMode = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    return unsubscribe;
  }, []);

  return isOffline;
};
```

## ⚠️ Важные напоминания

1. **ОБЯЗАТЕЛЬНО типизируйте все API запросы**
2. **ОБЯЗАТЕЛЬНО обрабатывайте ошибки и показывайте их пользователю**
3. **ОБЯЗАТЕЛЬНО показывайте индикаторы загрузки для всех запросов**
4. **ОБЯЗАТЕЛЬНО обрабатывайте пустые кейсы**
5. **Используйте централизованную обработку ошибок**
6. **Следуйте модульной архитектуре**
7. **Тестируйте API интеграцию**

## 🔍 Проверка правил

Перед коммитом убедитесь, что:

- ✅ Все API запросы типизированы
- ✅ Ошибки обрабатываются и показываются пользователю
- ✅ Индикаторы загрузки добавлены для всех запросов
- ✅ Пустые состояния обработаны
- ✅ API сервисы следуют установленной архитектуре
- ✅ Хуки правильно используют API сервисы
- ✅ Контексты управляют состоянием корректно
- ✅ Тесты покрывают основную функциональность

**Помните**: Качественная API интеграция - это основа надежного приложения! 🚀
