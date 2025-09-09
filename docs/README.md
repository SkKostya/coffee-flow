# Документация проекта Coffee Flow

## Обзор

Этот документ содержит всю необходимую документацию для работы с проектом Coffee Flow.

## 📚 Список документов

### 🎨 [Цветовая система](./COLORS.md)

- Правила использования цветов из палитры Colors.ts
- Запрет на хардкодные цвета
- Использование хука useColors для темизации

### 🏗️ [Архитектура](./ARCHITECTURE.md)

- Модульная структура проекта
- Правила организации файлов и папок
- Стандарты для auth, coffee-shops и shared модулей

### ⚛️ [React компоненты](./COMPONENTS.md)

- Структура и типизация компонентов
- Правила стилизации и логики
- Оптимизация производительности

### 🪝 [React хуки](./HOOKS.md)

- Структура и типизация хуков
- Управление состоянием и побочными эффектами
- Обработка ошибок и оптимизация

### 🔷 [TypeScript](./TYPESCRIPT.md)

- Строгая типизация всех сущностей
- Generic типы и utility types
- Union types и discriminated unions

### 📚 [Использование библиотек](./LIBRARIES.md)

- ВСЕГДА сначала искать готовые решения
- Использование проверенных библиотек
- Интеграция с архитектурой и дизайн-системой

### 🌐 [API и интеграция](./API.md)

- Централизованная обработка ошибок и состояний
- Типизация всех API запросов
- Обработка ошибок и показ индикаторов загрузки

### 🚀 [API интеграция](./API_INTEGRATION.md)

- Подробная документация по интеграции с бэкендом
- Структура API и эндпоинты
- Архитектура и использование

### 📖 [Примеры использования API](./API_USAGE_EXAMPLES.md)

- Практические примеры использования API
- Обработка ошибок и состояний
- Тестирование и расширение функциональности

### 🔧 [Руководство по настройке API](./API_SETUP_GUIDE.md)

- Пошаговые инструкции по настройке
- Использование в компонентах
- Troubleshooting и расширение

## 🚀 Быстрый старт

1. **Новый компонент**: Следуйте правилам из `COMPONENTS.md`
2. **Новый хук**: Используйте правила из `HOOKS.md`
3. **Новые типы**: Следуйте правилам из `TYPESCRIPT.md`
4. **Новые цвета**: Используйте только палитру из `COLORS.md`
5. **Новая структура**: Следуйте архитектуре из `ARCHITECTURE.md`
6. **Готовые решения**: Следуйте правилам из `LIBRARIES.md`
7. **API интеграция**: Следуйте правилам из `API.md`

## 📁 Структура проекта

```
src/
├── auth/                    # Модуль аутентификации
│   ├── components/         # UI компоненты модуля
│   ├── contexts/          # React контексты
│   ├── hooks/             # Хуки модуля
│   ├── services/          # API сервисы
│   └── validation/        # Валидация модуля
├── coffee-shops/           # Модуль кофеен
│   ├── components/        # UI компоненты модуля
│   ├── hooks/             # Хуки модуля
│   ├── services/          # API сервисы
│   └── types/             # Типы модуля
├── shared/                 # Глобальные компоненты и утилиты
│   ├── components/        # Переиспользуемые UI компоненты
│   ├── hooks/             # Глобальные хуки
│   ├── contexts/          # React контексты
│   ├── constants/         # Глобальные константы
│   └── theme/             # Тема и стили
└── types/                  # TypeScript типы
    ├── index.ts           # Главный экспорт типов
    ├── auth.ts            # Типы аутентификации
    ├── coffee-shops.ts    # Типы кофеен
    └── orders.ts          # Типы заказов
```

## 🎯 Основные принципы

- **Модульность**: Каждый модуль имеет четкую ответственность
- **Переиспользование**: Компоненты и хуки должны быть переиспользуемыми
- **Типизация**: Строгая TypeScript типизация для всех сущностей
- **Цветовая система**: Использование только палитры Colors.ts
- **Архитектура**: Следование установленной структуре проекта
- **Адаптивность**: Все компоненты должны работать на всех устройствах
- **Готовые решения**: ВСЕГДА сначала ищите готовые библиотеки
- **API интеграция**: ОБЯЗАТЕЛЬНО типизируйте запросы и обрабатывайте ошибки

## 🔧 Создание новых файлов

### В модуле auth:

- Специфичные для аутентификации компоненты
- Хуки для работы с данными аутентификации
- Валидация форм аутентификации
- API сервисы для аутентификации

### В модуле coffee-shops:

- Специфичные для кофеен компоненты
- Хуки для работы с данными кофеен
- API сервисы для кофеен

### В shared:

- Переиспользуемые UI компоненты
- Глобальные хуки и контексты
- Общие константы и утилиты

### В types:

- Централизованные типы для всего проекта
- Интерфейсы для API и данных
- Utility types и generic типы

## 📝 Примеры использования

### Создание компонента:

```typescript
import React from 'react';
import { ViewStyle } from 'react-native';
import { useColors } from '../../shared/hooks';
import type { ComponentProps } from '../../types';

interface MyComponentProps {
  title: string;
  onPress: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  const colors = useColors();

  const containerStyle: ViewStyle = {
    backgroundColor: colors.backgrounds.primary,
  };

  return (
    <View style={containerStyle}>
      <Text style={{ color: colors.texts.primary }}>{title}</Text>
      <Button title="Нажми меня" onPress={onPress} />
    </View>
  );
};

export default MyComponent;
```

### Создание хука:

```typescript
import { useState, useCallback } from 'react';
import type { HookReturnType } from '../../types';

interface UseMyHookParams {
  initialValue?: string;
  onSuccess?: (value: string) => void;
}

interface UseMyHookReturn {
  value: string;
  setValue: (value: string) => void;
  handleAction: () => void;
}

const useMyHook = ({
  initialValue = '',
  onSuccess,
}: UseMyHookParams = {}): UseMyHookReturn => {
  const [value, setValue] = useState(initialValue);

  const handleAction = useCallback(() => {
    if (onSuccess) {
      onSuccess(value);
    }
  }, [value, onSuccess]);

  return { value, setValue, handleAction };
};

export default useMyHook;
```

### Создание API сервиса:

```typescript
import { ApiClient } from './ApiClient';
import type { MyData, MyResponse } from '../../types';

const apiClient = new ApiClient(API_URL);

export const myApi = {
  async getData(): Promise<MyResponse> {
    try {
      const response = await apiClient.get<MyResponse>('/my-endpoint');
      return response;
    } catch (error) {
      console.error('Ошибка получения данных:', error);
      throw error;
    }
  },

  async postData(data: MyData): Promise<MyResponse> {
    try {
      const response = await apiClient.post<MyResponse>('/my-endpoint', data);
      return response;
    } catch (error) {
      console.error('Ошибка отправки данных:', error);
      throw error;
    }
  },
};
```

## ⚠️ Важные напоминания

1. **ВСЕГДА используйте цвета из палитры Colors.ts**
2. **Следуйте модульной архитектуре проекта**
3. **Типизируйте все компоненты и хуки**
4. **Создавайте переиспользуемые сущности**
5. **Используйте barrel exports через index.ts файлы**
6. **Обеспечивайте адаптивность для всех устройств**
7. **Для сложных задач рассмотрите готовые библиотеки**
8. **API запросы ОБЯЗАТЕЛЬНО типизируйте и обрабатывайте ошибки**

## 🔍 Проверка правил

Перед коммитом убедитесь, что:

- ✅ Все цвета взяты из палитры Colors.ts
- ✅ Компоненты следуют правилам из COMPONENTS.md
- ✅ Хуки следуют правилам из HOOKS.md
- ✅ Типы следуют правилам из TYPESCRIPT.md
- ✅ Структура соответствует архитектуре из ARCHITECTURE.md
- ✅ Компоненты адаптивны для всех устройств
- ✅ Для сложных задач рассмотрены готовые библиотеки из LIBRARIES.md
- ✅ API запросы типизированы и обрабатываются ошибки согласно API.md

## 📚 Дополнительные ресурсы

- [React Native документация](https://reactnative.dev/)
- [TypeScript документация](https://www.typescriptlang.org/)
- [React хуки документация](https://react.dev/reference/react/hooks)
- [Expo документация](https://docs.expo.dev/)

**Помните**: Эти правила созданы для обеспечения качества, консистентности и поддерживаемости кода. Следуйте им для создания отличных приложений! 🚀
