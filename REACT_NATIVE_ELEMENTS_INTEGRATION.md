# React Native Elements Integration Guide

## 🚀 Обзор интеграции

Проект Coffee Flow успешно интегрирован с **React Native Elements** - мощной библиотекой UI компонентов для React Native. Эта интеграция обеспечивает:

- ✅ **Консистентный дизайн** для iOS и Android
- ✅ **Гибкую темизацию** с интеграцией в существующую цветовую систему
- ✅ **Готовые компоненты** для всех основных UI элементов
- ✅ **Адаптивность** для мобильных устройств и планшетов
- ✅ **TypeScript поддержку** для всех компонентов

## 📦 Установленные зависимости

```bash
pnpm add react-native-elements @rneui/themed react-native-vector-icons react-native-safe-area-context
```

## 🎨 Система темизации

### CoffeeFlowThemeProvider

Основной провайдер темы, который интегрирует React Native Elements с существующей цветовой системой:

```typescript
import { CoffeeFlowThemeProvider } from '../src/shared/theme';

// В главном layout
<CoffeeFlowThemeProvider>
  <App />
</CoffeeFlowThemeProvider>;
```

### useCoffeeFlowTheme хук

Хук для доступа к теме React Native Elements:

```typescript
import { useCoffeeFlowTheme } from '../src/shared/theme';

const MyComponent = () => {
  const { theme, isDark, toggleTheme } = useCoffeeFlowTheme();

  return <Button color="primary" title="Кнопка" />;
};
```

## 🔧 Основные компоненты

### 1. Button

```typescript
import { Button } from '@rneui/themed';

// Основная кнопка
<Button
  title="Нажми меня"
  type="solid"
  color="primary"
  onPress={handlePress}
/>

// Кнопка с outline
<Button
  title="Вторичная"
  type="outline"
  color="secondary"
  onPress={handlePress}
/>

// Кнопка с загрузкой
<Button
  title="Загрузка"
  loading={true}
  onPress={handlePress}
/>
```

### 2. Input

```typescript
import { Input } from '@rneui/themed';

// Базовое поле ввода
<Input
  label="Имя"
  placeholder="Введите ваше имя"
  value={name}
  onChangeText={setName}
  errorMessage={errors.name}
/>

// Поле с иконкой
<Input
  label="Email"
  placeholder="example@email.com"
  leftIcon={<Icon name="email" size={20} />}
  value={email}
  onChangeText={setEmail}
/>
```

### 3. Card

```typescript
import { Card } from '@rneui/themed';

// Базовая карточка
<Card>
  <Card.Title>Заголовок карточки</Card.Title>
  <Card.Divider />
  <Text>Содержимое карточки</Text>
</Card>

// Карточка с изображением
<Card>
  <Card.Image source={{ uri: 'https://example.com/image.jpg' }} />
  <Card.Title>Карточка с изображением</Card.Title>
  <Text>Описание</Text>
</Card>
```

### 4. SearchBar

```typescript
import { SearchBar } from '@rneui/themed';

<SearchBar
  placeholder="Поиск..."
  onChangeText={setSearchQuery}
  value={searchQuery}
  platform="default"
  round
  lightTheme
/>;
```

### 5. Tab

```typescript
import { Tab } from '@rneui/themed';

<Tab value={activeTab} onChange={setActiveTab}>
  <Tab.Item title="Первый" value="first" />
  <Tab.Item title="Второй" value="second" />
  <Tab.Item title="Третий" value="third" />
</Tab>;
```

## 🎯 Мигрированные компоненты

### Auth модуль

- ✅ **Button** - использует React Native Elements Button
- ✅ **InputField** - использует React Native Elements Input
- ✅ **PasswordInput** - использует React Native Elements Input с иконкой
- ✅ **PhoneInput** - использует React Native Elements Input с маской
- ✅ **FormError** - использует React Native Elements Card
- ✅ **ForgotPasswordLink** - использует React Native Elements Button

### Shared модуль

- ✅ **BottomNavigation** - использует React Native Elements Tab

### CoffeeShops модуль

- ✅ **CoffeeShopCard** - использует React Native Elements Card
- ✅ **SearchBar** - использует React Native Elements SearchBar

## 🎨 Настройка цветов

### Использование цветов темы

```typescript
import { useCoffeeFlowTheme } from '../src/shared/theme';

const MyComponent = () => {
  const { theme } = useCoffeeFlowTheme();

  return (
    <Button
      color="primary" // Использует primary цвет из темы
      buttonStyle={{
        backgroundColor: theme.colors.background, // Кастомный цвет
        borderColor: theme.colors.border,
      }}
    />
  );
};
```

### Интеграция с Colors.ts

Все цвета автоматически интегрированы через `themeAdapter.ts`:

```typescript
// Автоматически доступны в теме:
theme.colors.primary; // Colors.primary[500]
theme.colors.secondary; // Colors.secondary[500]
theme.colors.success; // Colors.success[500]
theme.colors.error; // Colors.error[500]
theme.colors.background; // Colors.ColorSchemes.dark/light.background
```

## 📱 Адаптивность

Все компоненты автоматически адаптируются к размеру экрана:

```typescript
import { useResponsive } from '../src/shared/hooks';

const MyComponent = () => {
  const { isMobile, isTablet } = useResponsive();

  return (
    <Button
      size={isMobile ? 'small' : 'medium'}
      titleStyle={{ fontSize: isMobile ? 14 : 16 }}
    />
  );
};
```

## 🚫 Что НЕ использовать

### Запрещено:

- ❌ `TouchableOpacity` вместо `Button`
- ❌ `TextInput` вместо `Input`
- ❌ `View` с кастомными стилями вместо `Card`
- ❌ Хардкодные цвета вместо темы
- ❌ Кастомные компоненты для базовых UI элементов

### Разрешено:

- ✅ `expo-image` для изображений (уже используется)
- ✅ `react-native-mask-input` для масок (интегрирован в Input)
- ✅ Кастомные компоненты для специфичной бизнес-логики

## 🔄 Создание новых компонентов

### Шаблон компонента

```typescript
import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { Button, Input, Card } from '@rneui/themed';
import { useCoffeeFlowTheme } from '../../shared/theme';
import { useColors } from '../../shared/hooks/useColors';

interface MyComponentProps {
  title: string;
  onPress: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  const { theme } = useCoffeeFlowTheme();
  const colors = useColors();

  const containerStyle: ViewStyle = {
    backgroundColor: colors.backgrounds.card,
    borderRadius: 16,
  };

  return (
    <Card containerStyle={containerStyle}>
      <Card.Title>{title}</Card.Title>
      <Button title="Действие" onPress={onPress} color="primary" />
    </Card>
  );
};

export default MyComponent;
```

## 🧪 Тестирование

### Установка зависимостей для тестирования

```bash
pnpm add -D @testing-library/react-native @testing-library/jest-native
```

### Пример теста

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <MyComponent title="Тест" onPress={jest.fn()} />
    );

    expect(getByText('Тест')).toBeTruthy();
    expect(getByText('Действие')).toBeTruthy();
  });

  it('calls onPress when button is pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <MyComponent title="Тест" onPress={onPress} />
    );

    fireEvent.press(getByText('Действие'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

## 📚 Полезные ссылки

- [React Native Elements документация](https://reactnativeelements.com/)
- [@rneui/themed API](https://reactnativeelements.com/docs/components/overview)
- [Coffee Flow правила компонентов](.cursor/rules/components.mdc)
- [Coffee Flow цветовая система](.cursor/rules/colors.mdc)

## 🎉 Заключение

Интеграция React Native Elements завершена! Теперь у вас есть:

- 🎨 **Консистентный дизайн** для всех платформ
- 🚀 **Быстрая разработка** с готовыми компонентами
- 🔧 **Гибкая настройка** через систему тем
- 📱 **Адаптивность** для всех устройств
- 🎯 **Строгая типизация** TypeScript

**Помните**: Всегда используйте React Native Elements для базовых UI компонентов! 🚀
