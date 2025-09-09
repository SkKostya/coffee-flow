# API Client Fixes

## Исправленные ошибки

### 1. **Неправильные импорты типов**

**Проблема:** В `ProtectedApiClient.ts` и `PublicApiClient.ts` типы импортировались из `./ApiClient`, но они должны импортироваться из `../types/api`.

**Исправление:**

```typescript
// Было:
import {
  ApiClient,
  ApiClientConfig,
  ApiInterceptors,
  AuthConfig,
} from './ApiClient';

// Стало:
import { ApiClientConfig, ApiInterceptors, AuthConfig } from '../types/api';
import { ApiClient } from './ApiClient';
```

### 2. **Проблема с типизацией интерцептора ответа**

**Проблема:** Интерцептор ответа возвращал `ApiResponse<unknown>`, но ожидался `ApiResponse<T>`.

**Исправление:**

```typescript
// Было:
return await this.interceptors.response(apiResponse);

// Стало:
return (await this.interceptors.response(apiResponse)) as ApiResponse<T>;
```

### 3. **Двойная сериализация данных**

**Проблема:** Данные сериализовались дважды - сначала в методах `post`, `put`, `patch`, `delete`, а затем снова в методе `request`.

**Исправление:**

- Убрал `JSON.parse(options.body)` в методе `request`
- Обновил тип `RequestConfig.data` с `unknown` на `string`
- Убрал повторную сериализацию в `fetch`

```typescript
// Было:
data: options.body ? JSON.parse(options.body) : undefined,
// ...
body: requestConfig.data ? JSON.stringify(requestConfig.data) : undefined,

// Стало:
data: options.body,
// ...
body: requestConfig.data,
```

## Результат

✅ Все ошибки линтера исправлены  
✅ API клиенты работают корректно  
✅ Типизация полностью корректна  
✅ Нет дублирования сериализации данных

## Структура исправленных файлов

```
src/shared/api/
├── ApiClient.ts           # Базовый API клиент (исправлен)
├── ProtectedApiClient.ts  # Защищенные запросы (исправлен)
├── PublicApiClient.ts     # Публичные запросы (исправлен)
└── index.ts              # Экспорты (исправлен)

src/shared/types/
└── api.ts                # Типы (исправлен)
```

## Проверка

Все модули, использующие API клиенты, проверены и работают без ошибок:

- ✅ `src/auth/services/authApi.ts`
- ✅ `src/profile/services/profileApi.ts`
