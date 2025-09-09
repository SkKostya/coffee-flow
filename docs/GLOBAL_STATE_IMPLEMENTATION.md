# Реализация глобального состояния для данных профиля

## Проблема

Каждый экран, который нуждался в данных пользователя, делал отдельный API запрос, что приводило к:

- Дублированию запросов
- Неэффективному использованию ресурсов
- Плохому UX (загрузка на каждом экране)
- Сложности синхронизации данных

## Решение

Создано глобальное состояние `ProfileContext` для централизованного управления данными пользователя.

## Архитектура

### 1. **ProfileContext**

```typescript
interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  clearProfile: () => void;
}
```

### 2. **Provider в корне приложения**

```typescript
// app/_layout.tsx
<AuthProvider>
  <ProfileProvider>
    <LayoutStack />
  </ProfileProvider>
</AuthProvider>
```

### 3. **Использование в компонентах**

```typescript
// Вместо useProfile()
const { profile, isLoading, error, updateProfile } = useProfileContext();
```

## Преимущества

### ✅ **Производительность**

- Данные загружаются один раз при запуске приложения
- Все экраны используют кэшированные данные
- Нет дублирования API запросов

### ✅ **UX улучшения**

- Мгновенный доступ к данным на всех экранах
- Нет повторных загрузок
- Синхронизация данных между экранами

### ✅ **Архитектура**

- Централизованное управление состоянием
- Единая точка истины для данных профиля
- Легко добавлять новые методы

### ✅ **Отладка**

- Все операции с профилем в одном месте
- Централизованное логирование
- Легко отслеживать изменения

## Реализация

### 1. **Создание контекста**

```typescript
// src/shared/contexts/ProfileContext.tsx
export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка профиля
  const loadProfile = useCallback(async () => {
    // ... логика загрузки
  }, []);

  // Обновление профиля
  const updateProfile = useCallback(async (data) => {
    // ... логика обновления
  }, []);

  // ... другие методы

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
```

### 2. **Интеграция в приложение**

```typescript
// app/_layout.tsx
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider>
          <CoffeeFlowThemeProvider>
            <AuthProvider>
              <ProfileProvider>
                <LayoutStack />
              </ProfileProvider>
            </AuthProvider>
          </CoffeeFlowThemeProvider>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
```

### 3. **Использование в компонентах**

```typescript
// app/account.tsx
import { useProfileContext } from '../src/shared/contexts/ProfileContext';

export default function AccountScreen() {
  const { profile, isLoading, error, refetch } = useProfileContext();
  // ... использование данных
}
```

### 4. **Обновление хуков форм**

```typescript
// src/profile/hooks/useEditAccountForm.ts
export const useEditAccountForm = ({ ... }) => {
  const { updateProfile } = useProfileContext();

  const handleFormSubmit = async (data) => {
    // Используем глобальное состояние
    const result = await updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      email: '',
    });
    // ...
  };
};
```

## Миграция

### Было:

```typescript
// Каждый экран делал свой запрос
const { profile, isLoading } = useProfile();
```

### Стало:

```typescript
// Все экраны используют глобальное состояние
const { profile, isLoading } = useProfileContext();
```

## Методы контекста

### 1. **loadProfile()** / **refetch()**

- Загружает данные профиля с сервера
- Вызывается автоматически при инициализации
- Можно вызвать вручную для обновления

### 2. **updateProfile(data)**

- Обновляет данные профиля
- Автоматически обновляет глобальное состояние
- Возвращает результат операции

### 3. **changePassword(data)**

- Изменяет пароль пользователя
- Не обновляет данные профиля (только пароль)

### 4. **deleteAccount(password)**

- Удаляет аккаунт пользователя
- Очищает глобальное состояние

### 5. **clearProfile()**

- Очищает данные профиля
- Вызывается при выходе из системы

## Жизненный цикл

```
1. Запуск приложения
2. ProfileProvider инициализируется
3. loadProfile() вызывается автоматически
4. Данные загружаются и сохраняются в состоянии
5. Все экраны получают доступ к данным
6. При изменениях состояние обновляется
7. При выходе clearProfile() очищает данные
```

## Отладка

Добавлены логи для отслеживания операций:

```typescript
console.log('🔄 Загружаем профиль из глобального состояния...');
console.log('✅ Профиль загружен в глобальное состояние:', response.data);
console.log('🧹 Очищаем профиль из глобального состояния');
```

## Проверка работы

1. **Запустите приложение** - данные должны загрузиться один раз
2. **Перейдите между экранами** - данные должны быть доступны мгновенно
3. **Измените профиль** - изменения должны отразиться на всех экранах
4. **Проверьте консоль** - должны быть логи операций

## Следующие шаги

1. **Добавить кэширование** - сохранять данные в AsyncStorage
2. **Оптимизировать обновления** - обновлять только измененные поля
3. **Добавить офлайн режим** - работать с кэшированными данными
4. **Добавить синхронизацию** - периодически обновлять данные

## Альтернативы

### Redux Toolkit

- Более сложная настройка
- Больше boilerplate кода
- Лучше для больших приложений

### Zustand

- Проще чем Redux
- Меньше кода
- Хорошо для средних приложений

### React Context (выбрано)

- Встроен в React
- Простая реализация
- Достаточно для текущих потребностей

## Заключение

Глобальное состояние решает проблему дублирования запросов и улучшает производительность приложения. Данные загружаются один раз и используются на всех экранах, что обеспечивает лучший UX и более эффективное использование ресурсов.
