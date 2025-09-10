# Миграция на Redux Toolkit

## Обзор

Проект Coffee Flow был успешно мигрирован с React Context на Redux Toolkit для управления глобальным состоянием.

## Что изменилось

### Удаленные контексты

- ❌ `AuthContext` - заменен на `useAuth` хук
- ❌ `ProfileContext` - заменен на `useProfile` хук
- ❌ `ThemeContext` - заменен на `useTheme` хук

### Новые Redux хуки

- ✅ `useAuth()` - управление аутентификацией
- ✅ `useProfile()` - управление профилем пользователя
- ✅ `useTheme()` - управление темой приложения

## Использование

### Аутентификация

```typescript
import { useAuth } from '../src/store';

const { user, isAuthenticated, login, logout } = useAuth();
```

### Профиль

```typescript
import { useProfile } from '../src/store';

const { profile, updateProfile, changePassword } = useProfile();
```

### Тема

```typescript
import { useTheme } from '../src/store';

const { theme, isDark, toggleTheme, colors } = useTheme();
```

## Структура Redux store

```
src/store/
├── index.ts                    # Основной store
├── ReduxProvider.tsx           # React Provider
├── AppInitializer.tsx          # Инициализация приложения
├── hooks.ts                    # Базовые хуки
├── types.ts                    # Типы
├── slices/                     # Redux slices
│   ├── authSlice.ts           # Аутентификация
│   ├── profileSlice.ts        # Профиль
│   └── themeSlice.ts          # Тема
├── selectors/                  # Селекторы
│   ├── authSelectors.ts       # Селекторы auth
│   ├── profileSelectors.ts    # Селекторы profile
│   └── themeSelectors.ts      # Селекторы theme
└── hooks/                      # Специализированные хуки
    ├── useAuth.ts             # Хук аутентификации
    ├── useProfile.ts          # Хук профиля
    ├── useTheme.ts            # Хук темы
    └── useAppInitialization.ts # Хук инициализации
```

## Преимущества

### ✅ Производительность

- Оптимизированные ре-рендеры
- Мемоизированные селекторы
- Централизованное управление состоянием

### ✅ Отладка

- Redux DevTools интеграция
- Временная шкала действий
- Предсказуемые обновления состояния

### ✅ Масштабируемость

- Модульная архитектура
- Легко добавлять новые слайсы
- Типизированные действия

### ✅ Персистентность

- Автоматическое сохранение в AsyncStorage
- Восстановление состояния при перезапуске
- Настраиваемые правила персистентности

## Миграция компонентов

### Было (Context)

```typescript
import { useAuthContext } from '../contexts/AuthContext';
const { user, login } = useAuthContext();
```

### Стало (Redux)

```typescript
import { useAuth } from '../store';
const { user, login } = useAuth();
```

## Настройка

Redux store автоматически инициализируется в `app/_layout.tsx`:

```typescript
import { ReduxProvider } from '../src/store';

export default function RootLayout() {
  return <ReduxProvider>{/* Ваше приложение */}</ReduxProvider>;
}
```

## Заключение

Миграция завершена успешно. Все компоненты теперь используют Redux Toolkit для управления состоянием. Старые контексты удалены, код стал более предсказуемым и масштабируемым.
