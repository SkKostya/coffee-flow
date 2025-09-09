# Account Screen API Integration

## Обзор

Страница `app/account.tsx` была обновлена для использования реальных данных пользователя с сервера вместо хардкодных значений.

## Изменения

### 1. **Добавлены импорты**

```typescript
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useProfile } from '../src/profile/hooks/useProfile';
```

### 2. **Интеграция с API профиля**

```typescript
const { profile, isLoading, error, refetch } = useProfile();
```

### 3. **Обработка состояний**

#### Состояние загрузки

```typescript
if (isLoading) {
  return (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text>Загрузка данных...</Text>
      </View>
    </View>
  );
}
```

#### Состояние ошибки

```typescript
if (error) {
  return (
    <View style={styles.container}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ошибка загрузки данных: {error}</Text>
        <View style={styles.retryButton}>
          <Text onPress={refetch}>Повторить</Text>
        </View>
      </View>
    </View>
  );
}
```

### 4. **Реальные данные пользователя**

#### Было (хардкод):

```typescript
<Text style={styles.infoValue}>Аружан</Text>
<Text style={styles.infoValue}>+7 (777) 777 77-77</Text>
```

#### Стало (API):

```typescript
<Text style={styles.infoValue}>
  {profile ? `${profile.firstName} ${profile.lastName}` : 'Не указано'}
</Text>
<Text style={styles.infoValue}>
  {profile?.phoneNumber || 'Не указано'}
</Text>
<Text style={styles.infoValue}>
  {profile?.email || 'Не указано'}
</Text>
<Text style={styles.infoValue}>
  {profile?.isActive ? 'Активен' : 'Неактивен'}
</Text>
<Text style={styles.infoValue}>
  {profile?.isPhoneVerified ? 'Да' : 'Нет'}
</Text>
```

### 5. **Автоматическое обновление данных**

```typescript
useFocusEffect(
  useCallback(() => {
    refetch();
  }, [refetch])
);
```

## Новые стили

```typescript
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors.backgrounds.primary,
},
errorContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors.backgrounds.primary,
  padding: 20,
},
errorText: {
  fontSize: 16,
  color: colors.error.main,
  textAlign: 'center',
  marginBottom: 16,
},
retryButton: {
  backgroundColor: colors.primary.main,
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 8,
},
retryButtonText: {
  color: colors.texts.inverse,
  fontSize: 16,
  fontWeight: '600',
},
```

## Отображаемые данные

### Основная информация

- **Имя**: `profile.firstName + profile.lastName`
- **Номер телефона**: `profile.phoneNumber`
- **Email**: `profile.email`
- **Статус аккаунта**: `profile.isActive` (Активен/Неактивен)
- **Подтверждение телефона**: `profile.isPhoneVerified` (Да/Нет)

### Fallback значения

Если данные не загружены или отсутствуют, отображается "Не указано".

## Функциональность

### 1. **Автоматическая загрузка**

- Данные загружаются при открытии экрана
- Обновляются при возврате на экран (useFocusEffect)

### 2. **Обработка ошибок**

- Показ ошибки с возможностью повтора
- Graceful fallback для отсутствующих данных

### 3. **Состояния загрузки**

- Индикатор загрузки во время запроса
- Плавные переходы между состояниями

### 4. **Интеграция с модальными окнами**

- `DeleteAccountModal` использует API для удаления аккаунта
- Обработка результатов операций

## Преимущества

1. **Реальные данные**: Отображение актуальной информации пользователя
2. **Автоматическое обновление**: Данные обновляются при изменениях
3. **Обработка ошибок**: Пользователь видит ошибки и может повторить запрос
4. **UX**: Плавные переходы и индикаторы загрузки
5. **Надежность**: Fallback значения для отсутствующих данных

## API Endpoints

Страница использует следующие API endpoints:

- `GET /clients/profile` - получение данных профиля
- `DELETE /clients/profile` - удаление аккаунта (через модальное окно)

## Зависимости

- `useProfile` хук из модуля profile
- `DeleteAccountModal` компонент из модуля profile
- `useColors` хук для темизации
- `useFocusEffect` для автоматического обновления
