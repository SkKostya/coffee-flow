# API Client Refactoring

## Обзор

Проведен рефакторинг API клиентов для устранения дублирования кода и создания единой системы управления API запросами в проекте.

## Проблема

Ранее в проекте было два отдельных API клиента:

- `ApiClient` в модуле `auth`
- `ProfileApiClient` в модуле `profile`

Это приводило к:

- Дублированию кода
- Сложности в поддержке
- Несогласованности в обработке ошибок
- Отсутствию разделения на защищенные и публичные запросы

## Решение

Создана единая система API клиентов в модуле `shared`:

### 1. Базовый API клиент (`ApiClient`)

```typescript
import { ApiClient } from '@shared/api';

const client = new ApiClient(config, authConfig, interceptors);
```

**Возможности:**

- Универсальные HTTP методы (GET, POST, PUT, PATCH, DELETE)
- Автоматическое добавление токена авторизации
- Обработка ошибок и таймаутов
- Интерцепторы для запросов и ответов
- Настраиваемая конфигурация

### 2. Защищенный API клиент (`ProtectedApiClient`)

```typescript
import { protectedApiClient } from '@shared/api';

// Автоматически добавляет токен авторизации
const response = await protectedApiClient.get('/clients/profile');
```

**Использование:**

- Для всех запросов, требующих авторизации
- Автоматически добавляет токен из AsyncStorage
- Обрабатывает истечение токена (401 ошибки)

### 3. Публичный API клиент (`PublicApiClient`)

```typescript
import { publicApiClient } from '@shared/api';

// Не требует авторизации
const response = await publicApiClient.post('/clients/signin', credentials);
```

**Использование:**

- Для запросов без авторизации (регистрация, вход)
- Не добавляет токен в заголовки

## Структура файлов

```
src/shared/
├── api/
│   ├── ApiClient.ts           # Базовый API клиент
│   ├── ProtectedApiClient.ts  # Защищенные запросы
│   ├── PublicApiClient.ts     # Публичные запросы
│   └── index.ts              # Экспорты
└── types/
    └── api.ts                # Общие типы для API
```

## Конфигурация

### Базовая конфигурация

```typescript
import { ApiClient } from '@shared/api';

const client = new ApiClient({
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
});
```

### Конфигурация аутентификации

```typescript
const client = new ApiClient(config, {
  tokenKey: '@my_app_token',
  getToken: async () => {
    return await AsyncStorage.getItem('@my_app_token');
  },
  onTokenExpired: () => {
    // Обработка истечения токена
    logout();
  },
});
```

### Интерцепторы

```typescript
const client = new ApiClient(config, authConfig, {
  request: (config) => {
    console.log('Отправка запроса:', config.url);
    return config;
  },
  response: (response) => {
    console.log('Получен ответ:', response);
    return response;
  },
  error: (error) => {
    console.error('Ошибка API:', error);
    return error;
  },
});
```

## Использование в модулях

### Auth модуль

```typescript
// src/auth/services/authApi.ts
import { publicApiClient } from '@shared/api';

export const authApi = {
  async signin(credentials: LoginCredentials) {
    const response = await publicApiClient.post('/clients/signin', credentials);

    if (!response.success) {
      throw new Error(response.error || 'Ошибка авторизации');
    }

    return response.data!;
  },
};
```

### Profile модуль

```typescript
// src/profile/services/profileApi.ts
import { protectedApiClient } from '@shared/api';

export const profileApi = {
  async getProfile() {
    return protectedApiClient.get('/clients/profile');
  },

  async updateProfile(data: UpdateProfileRequest) {
    return protectedApiClient.put('/clients/profile', data);
  },
};
```

## Типы данных

### Общие типы

```typescript
// src/shared/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
```

### Специфичные типы модулей

```typescript
// src/profile/types/api.ts
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  // ... другие поля
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}
```

## Миграция

### До рефакторинга

```typescript
// Старый код
class ProfileApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}) {
    // Дублированный код...
  }
}

const apiClient = new ProfileApiClient();
```

### После рефакторинга

```typescript
// Новый код
import { protectedApiClient } from '@shared/api';

// Простое использование
const response = await protectedApiClient.get('/clients/profile');
```

## Преимущества

1. **DRY принцип**: Устранено дублирование кода
2. **Единообразие**: Все модули используют одинаковый подход
3. **Разделение ответственности**: Четкое разделение на защищенные и публичные запросы
4. **Легкость поддержки**: Изменения в одном месте
5. **Типизация**: Полная TypeScript поддержка
6. **Гибкость**: Настраиваемые конфигурации и интерцепторы

## Примеры использования

### Создание кастомного клиента

```typescript
import { ApiClient } from '@shared/api';

const customClient = new ApiClient(
  {
    baseUrl: 'https://api.special.com',
    timeout: 5000,
  },
  {
    tokenKey: '@special_token',
    getToken: async () => await getSpecialToken(),
  }
);
```

### Использование в компонентах

```typescript
import { useProfile } from '@profile/';

const MyComponent = () => {
  const { profile, updateProfile } = useProfile();

  const handleUpdate = async () => {
    const result = await updateProfile({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    });

    if (result.success) {
      console.log('Профиль обновлен');
    } else {
      console.error('Ошибка:', result.error);
    }
  };

  return (
    <View>
      <Text>{profile?.firstName}</Text>
      <Button title="Обновить" onPress={handleUpdate} />
    </View>
  );
};
```

## Заключение

Рефакторинг API клиентов значительно упростил архитектуру проекта, устранил дублирование кода и обеспечил единообразный подход к работе с API во всех модулях. Теперь добавление новых API endpoints или изменение логики запросов требует изменений только в одном месте.
