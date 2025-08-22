# Coffee Flow ☕

Современное React Native приложение для управления кофейнями с полностью адаптивной версткой.

## ✨ Особенности

- **Адаптивная верстка** для всех устройств (мобильные, планшеты, десктопы)
- **Модульная архитектура** с четким разделением ответственности
- **TypeScript** с строгой типизацией
- **Цветовая система** с поддержкой тем
- **Responsive компоненты** автоматически адаптирующиеся под размер экрана

## 🚀 Быстрый старт

1. Установите зависимости

   ```bash
   npm install
   ```

2. Запустите приложение

   ```bash
   npx expo start
   ```

## 📱 Адаптивная верстка

Проект поддерживает все размеры экранов:

- **Мобильные устройства** (320px - 767px)
- **Планшеты** (768px - 1023px)
- **Большие планшеты** (1024px - 1439px)
- **Десктопы** (1440px+)

### Использование

```typescript
import { useResponsive } from './src/shared/hooks';

const MyComponent = () => {
  const { isMobile, isTablet, currentBreakpoint } = useResponsive();

  if (isMobile) {
    return <MobileLayout />;
  }

  if (isTablet) {
    return <TabletLayout />;
  }

  return <DesktopLayout />;
};
```

Подробнее в [документации по адаптивной верстке](./docs/RESPONSIVE.md).

## 🏗️ Архитектура

```
src/
├── auth/                    # Модуль аутентификации
│   ├── components/         # UI компоненты модуля
│   ├── hooks/             # Хуки модуля
│   └── validation/        # Валидация модуля
├── shared/                 # Глобальные компоненты и утилиты
│   ├── components/        # Переиспользуемые UI компоненты
│   ├── hooks/             # Глобальные хуки
│   ├── constants/         # Константы и responsive стили
│   └── contexts/          # React контексты
└── types/                  # TypeScript типы
```

## 🎨 Цветовая система

Используйте только цвета из палитры `Colors.ts`:

```typescript
import { useColors } from './src/shared/hooks';

const MyComponent = () => {
  const colors = useColors();

  return (
    <View style={{ backgroundColor: colors.backgrounds.primary }}>
      <Text style={{ color: colors.texts.primary }}>Текст</Text>
    </View>
  );
};
```

## 📚 Документация

- [Правила проекта](./docs/README.md)
- [Адаптивная верстка](./docs/RESPONSIVE.md)
- [Цветовая система](./docs/COLORS.md)

## 🧪 Тестирование

Тестируйте адаптивность на разных устройствах:

- Мобильные эмуляторы
- Планшетные эмуляторы
- Разные ориентации экрана

## 🔧 Разработка

### Создание нового компонента

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useColors, useResponsive } from '../shared/hooks';

const MyComponent = () => {
  const colors = useColors();
  const { isMobile } = useResponsive();

  return (
    <View
      style={{
        backgroundColor: colors.backgrounds.primary,
        padding: isMobile ? 16 : 24,
      }}
    >
      <Text style={{ color: colors.texts.primary }}>Адаптивный компонент</Text>
    </View>
  );
};
```

### Сброс проекта

Когда будете готовы начать с чистого листа:

```bash
npm run reset-project
```

## 📖 Узнать больше

- [Expo документация](https://docs.expo.dev/)
- [React Native документация](https://reactnative.dev/)
- [TypeScript документация](https://www.typescriptlang.org/)

## 🤝 Сообщество

Присоединяйтесь к сообществу разработчиков:

- [Expo на GitHub](https://github.com/expo/expo)
- [Discord сообщество](https://chat.expo.dev)

---

**Coffee Flow** - создавайте отличные приложения для кофеен! ☕✨
