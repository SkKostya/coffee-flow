# Исправление проблемы с useFocusEffect

## Проблема

`useFocusEffect` вызывал бесконечный цикл обновлений из-за нестабильной ссылки на функцию `refetch`.

## Причина

```typescript
// Проблемный код
const loadProfile = async () => {
  /* ... */
}; // Создается заново при каждом рендере

useFocusEffect(
  useCallback(() => {
    refetch(); // refetch = loadProfile, который меняется каждый раз
  }, [refetch]) // refetch меняется → useCallback пересоздается → useFocusEffect срабатывает снова
);
```

## Решение

### 1. **Обернули функции в useCallback**

```typescript
// Загрузка профиля
const loadProfile = useCallback(async () => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await profileApi.getProfile();

    if (response.success && response.data) {
      setProfile(response.data);
    } else {
      setError(response.error || 'Ошибка загрузки профиля');
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Ошибка загрузки профиля';
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
}, []); // Пустой массив зависимостей - функция стабильна

// Обновление профиля
const updateProfile = useCallback(
  async (data: { firstName: string; lastName: string; email: string }) => {
    // ... логика обновления
  },
  []
);

// Удаление аккаунта
const deleteAccount = useCallback(async (password: string) => {
  // ... логика удаления
}, []);
```

### 2. **Исправили useEffect**

```typescript
// Было:
useEffect(() => {
  loadProfile();
}, []); // loadProfile не в зависимостях

// Стало:
useEffect(() => {
  loadProfile();
}, [loadProfile]); // loadProfile теперь стабильная ссылка
```

### 3. **useFocusEffect теперь работает корректно**

```typescript
useFocusEffect(
  useCallback(() => {
    refetch(); // refetch = loadProfile, который теперь стабилен
  }, [refetch]) // refetch не меняется → useCallback не пересоздается
);
```

## Результат

✅ **Нет бесконечных циклов** - функции стабильны благодаря `useCallback`  
✅ **useFocusEffect работает** - данные обновляются при возврате на экран  
✅ **useEffect работает** - данные загружаются при инициализации  
✅ **Производительность улучшена** - функции не пересоздаются без необходимости

## Ключевые принципы

### 1. **Стабильность ссылок**

- Используйте `useCallback` для функций, передаваемых в зависимости
- Пустой массив зависимостей `[]` для функций, которые не зависят от внешних переменных

### 2. **Правильные зависимости**

- Включайте все используемые переменные в массив зависимостей
- Исключение: функции, обернутые в `useCallback` с пустым массивом зависимостей

### 3. **Избегайте пересоздания**

- Не создавайте функции внутри JSX
- Используйте `useCallback` для обработчиков событий
- Мемоизируйте объекты с `useMemo` при необходимости

## Примеры правильного использования

```typescript
// ✅ Правильно - стабильная функция
const handleSubmit = useCallback((data: FormData) => {
  // логика
}, []);

// ✅ Правильно - функция с зависимостями
const handleUpdate = useCallback(
  (id: string) => {
    updateItem(id, currentValue);
  },
  [currentValue]
);

// ❌ Неправильно - функция пересоздается каждый раз
const handleClick = () => {
  // логика
};

// ❌ Неправильно - нестабильная зависимость
useEffect(() => {
  loadData();
}, [loadData]); // loadData меняется каждый раз
```

## Проверка работы

1. Откройте страницу account.tsx
2. Перейдите на другую страницу
3. Вернитесь на account.tsx
4. Данные должны обновиться (если есть изменения)
5. Нет бесконечных запросов в консоли

## Дополнительные улучшения

Можно добавить проверку на необходимость обновления:

```typescript
useFocusEffect(
  useCallback(() => {
    // Обновляем только если данные устарели
    const lastUpdate = profile?.updatedAt;
    const now = new Date().toISOString();

    if (
      !lastUpdate ||
      new Date(now).getTime() - new Date(lastUpdate).getTime() > 30000
    ) {
      refetch();
    }
  }, [refetch, profile?.updatedAt])
);
```
