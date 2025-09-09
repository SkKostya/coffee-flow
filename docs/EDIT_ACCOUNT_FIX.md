# Исправление автозаполнения данных в форме редактирования профиля

## Проблема

На странице `edit-account.tsx` данные пользователя не подставлялись по умолчанию, хотя пользователь был залогинен.

## Причина

Данные профиля загружаются асинхронно через API, а форма инициализируется сразу с пустыми значениями. К моменту инициализации формы данные профиля еще не были загружены.

## Решение

### 1. **Добавлена обработка состояния загрузки**

```typescript
const { profile, isLoading } = useProfile();

// Показываем индикатор загрузки пока данные профиля не загружены
if (isLoading) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgrounds.primary,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary.main} />
    </View>
  );
}
```

### 2. **Добавлено обновление формы при загрузке данных**

```typescript
// Обновляем форму при загрузке данных профиля
useEffect(() => {
  console.log('🔄 Profile data changed:', { profile, isLoading });
  if (profile && !isLoading) {
    console.log('📝 Updating form with profile data:', {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
    });
    setValue('firstName', profile.firstName || '');
    setValue('lastName', profile.lastName || '');
    setValue('phoneNumber', profile.phoneNumber || '');
  }
}, [profile, isLoading, setValue]);
```

### 3. **Изменена инициализация формы**

```typescript
// Было:
const { ... } = useEditAccountForm({
  initialFirstName: profile?.firstName || '', // profile еще null
  initialLastName: profile?.lastName || '',
  initialPhone: profile?.phoneNumber || '',
  // ...
});

// Стало:
const { ... } = useEditAccountForm({
  initialFirstName: '', // Инициализируем пустыми значениями
  initialLastName: '',
  initialPhone: '',
  // ...
});
```

### 4. **Добавлена отладочная информация**

```typescript
console.log('🔄 Profile data changed:', { profile, isLoading });
console.log('📝 Updating form with profile data:', {
  firstName: profile.firstName,
  lastName: profile.lastName,
  phoneNumber: profile.phoneNumber,
});
```

## Как это работает

1. **Загрузка данных** - `useProfile` загружает данные пользователя
2. **Показ загрузки** - пока `isLoading = true`, показывается индикатор
3. **Обновление формы** - когда данные загружены, `useEffect` обновляет поля формы
4. **Отображение формы** - форма показывается с заполненными данными

## Последовательность событий

```
1. Открытие страницы edit-account.tsx
2. useProfile начинает загрузку данных (isLoading = true)
3. Показывается индикатор загрузки
4. API возвращает данные профиля
5. useProfile обновляет состояние (isLoading = false, profile = данные)
6. useEffect срабатывает и обновляет форму через setValue
7. Форма отображается с заполненными данными
```

## Преимущества

✅ **Правильная последовательность** - форма обновляется после загрузки данных  
✅ **UX улучшен** - пользователь видит индикатор загрузки  
✅ **Надежность** - нет гонки условий между загрузкой и инициализацией  
✅ **Отладка** - можно видеть в консоли, что происходит

## Проверка работы

1. Откройте страницу редактирования профиля
2. Должен появиться индикатор загрузки
3. Через 1-2 секунды форма должна заполниться данными пользователя
4. В консоли должны быть отладочные сообщения

## Альтернативные решения

### Вариант 1: Ожидание данных перед рендером

```typescript
if (isLoading || !profile) {
  return <LoadingScreen />;
}
// Рендерим форму только когда данные есть
```

### Вариант 2: Условная инициализация

```typescript
const formData = useEditAccountForm({
  initialFirstName: profile?.firstName || '',
  // ...
});
```

### Вариант 3: Ключ для пересоздания формы

```typescript
const formData = useEditAccountForm(
  {
    // ...
  },
  profile?.id
); // Пересоздаем форму при изменении профиля
```

## Выбранное решение

Выбран **Вариант 1** с дополнительным `useEffect` для обновления формы, так как он:

- Простой и понятный
- Не требует пересоздания формы
- Дает хороший UX с индикатором загрузки
- Легко отлаживается
