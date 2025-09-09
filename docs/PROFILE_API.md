# Profile API Documentation

## Обзор

Модуль `profile` предоставляет API для работы с профилем пользователя, включая получение, обновление, удаление аккаунта и изменение пароля.

## API Endpoints

### 1. Получение профиля

**GET** `/clients/profile`

**Response:**

```typescript
{
  "id": "uuid",
  "phoneNumber": "+77001234567",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "isActive": true,
  "isPhoneVerified": true,
  "currentCityId": "uuid",
  "latitude": 43.222,
  "longitude": 76.8512,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Обновление профиля

**PUT** `/clients/profile`

**Request Body:**

```typescript
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}
```

**Response:** Аналогичен GET запросу

### 3. Удаление аккаунта

**DELETE** `/clients/profile`

**Request Body:**

```typescript
{
  "password": "currentpassword123"
}
```

**Response:**

```typescript
{
  "message": "Operation completed successfully"
}
```

### 4. Изменение пароля

**PUT** `/clients/change-password`

**Request Body:**

```typescript
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response:**

```typescript
{
  "message": "Operation completed successfully"
}
```

## Использование в коде

### 1. Хук useProfile

```typescript
import { useProfile } from '@profile/';

const MyComponent = () => {
  const { profile, isLoading, error, refetch, updateProfile, deleteAccount } =
    useProfile();

  const handleUpdateProfile = async () => {
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

  if (isLoading) return <Text>Загрузка...</Text>;
  if (error) return <Text>Ошибка: {error}</Text>;

  return (
    <View>
      <Text>
        {profile?.firstName} {profile?.lastName}
      </Text>
      <Button title="Обновить" onPress={handleUpdateProfile} />
    </View>
  );
};
```

### 2. Хук useEditAccountForm

```typescript
import { useEditAccountForm } from '@profile/';

const EditAccountForm = () => {
  const {
    control,
    name,
    phoneNumber,
    errors,
    isValid,
    isSubmitting,
    formError,
    hasChanges,
    handleSubmit,
    reset,
  } = useEditAccountForm({
    initialName: 'John Doe',
    initialPhone: '+7 (771) 123-45-67',
  });

  return (
    <View>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Имя"
            value={value}
            onChangeText={onChange}
            errorMessage={errors.name?.message}
          />
        )}
      />

      <Button
        title="Сохранить"
        onPress={handleSubmit}
        disabled={!isValid || isSubmitting}
        loading={isSubmitting}
      />

      {formError && <Text style={{ color: 'red' }}>{formError}</Text>}
    </View>
  );
};
```

### 3. Хук useChangePasswordForm

```typescript
import { useChangePasswordForm } from '@profile/';

const ChangePasswordForm = () => {
  const {
    control,
    newPassword,
    confirmPassword,
    errors,
    isValid,
    isSubmitting,
    formError,
    handleSubmit,
    reset,
  } = useChangePasswordForm();

  return (
    <View>
      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Новый пароль"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            errorMessage={errors.newPassword?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Подтвердите пароль"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            errorMessage={errors.confirmPassword?.message}
          />
        )}
      />

      <Button
        title="Изменить пароль"
        onPress={handleSubmit}
        disabled={!isValid || isSubmitting}
        loading={isSubmitting}
      />

      {formError && <Text style={{ color: 'red' }}>{formError}</Text>}
    </View>
  );
};
```

### 4. Компоненты модальных окон

```typescript
import { AddCardModal, DeleteAccountModal, DeleteCardModal } from '@profile/';

const MyComponent = () => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showDeleteCard, setShowDeleteCard] = useState(false);

  return (
    <View>
      <Button title="Добавить карту" onPress={() => setShowAddCard(true)} />
      <Button
        title="Удалить аккаунт"
        onPress={() => setShowDeleteAccount(true)}
      />
      <Button title="Удалить карту" onPress={() => setShowDeleteCard(true)} />

      <AddCardModal
        isVisible={showAddCard}
        onClose={() => setShowAddCard(false)}
        onSubmit={(data) => {
          console.log('Добавление карты:', data);
          setShowAddCard(false);
        }}
      />

      <DeleteAccountModal
        isVisible={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        onConfirm={() => {
          console.log('Аккаунт удален');
          setShowDeleteAccount(false);
        }}
      />

      <DeleteCardModal
        isVisible={showDeleteCard}
        cardNumber="1234"
        onClose={() => setShowDeleteCard(false)}
        onConfirm={() => {
          console.log('Карта удалена');
          setShowDeleteCard(false);
        }}
      />
    </View>
  );
};
```

## Типы данных

### UserProfile

```typescript
interface UserProfile {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  currentCityId: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}
```

### API Response

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

## Обработка ошибок

Все API методы возвращают объект с полем `success` и опциональными полями `data` и `error`:

```typescript
const result = await updateProfile(data);

if (result.success) {
  // Успешное выполнение
  console.log('Данные:', result.data);
} else {
  // Ошибка
  console.error('Ошибка:', result.error);
}
```

## Авторизация

Все API запросы автоматически включают токен авторизации из AsyncStorage. Токен добавляется в заголовок `Authorization: Bearer <token>`.

## Примеры использования

### Полный экран профиля

```typescript
import { ProfileScreen } from '@profile/';

const App = () => {
  return <ProfileScreen />;
};
```

### Кастомная форма редактирования

```typescript
import { useEditAccountForm } from '@profile/';

const CustomEditForm = () => {
  const { control, handleSubmit, isSubmitting } = useEditAccountForm();

  return (
    <View>
      {/* Ваши поля формы */}
      <Button title="Сохранить" onPress={handleSubmit} loading={isSubmitting} />
    </View>
  );
};
```

## Примечания

1. **Токен авторизации**: Все запросы автоматически включают токен из AsyncStorage
2. **Обработка ошибок**: Все методы возвращают стандартизированный ответ с полем `success`
3. **Валидация**: Формы используют Zod схемы для валидации данных
4. **Типизация**: Все API методы полностью типизированы с TypeScript
5. **Состояние загрузки**: Хуки предоставляют состояние загрузки для UI
6. **Обработка ошибок**: Все ошибки обрабатываются и отображаются пользователю
