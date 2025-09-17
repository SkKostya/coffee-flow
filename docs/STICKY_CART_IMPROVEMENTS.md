# Улучшения StickyCart - Решение проблемы перекрытия контента

## Проблема

Ранее компонент `StickyCart` использовал `position: 'absolute'`, что приводило к перекрытию контента. Пользователи не могли прокрутить до элементов, которые скрывались под корзиной.

## Решение

### 1. Изменения в StickyCart.tsx

- Оставили `position: 'absolute'` для sticky поведения
- Добавили динамическое измерение высоты корзины

### 2. Новый контекст StickyCartContext

Создан контекст для управления состоянием sticky cart:

```typescript
interface StickyCartContextType {
  cartHeight: number;
  setCartHeight: (height: number) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}
```

### 3. Обновленный StickyCartWrapper

- Использует контекст для управления высотой
- Автоматически измеряет высоту корзины
- Добавляет отступ для контента

### 4. Новый компонент ContentWithStickyCart

Компонент-обёртка, который автоматически добавляет отступ снизу:

```typescript
<ContentWithStickyCart>
  <YourContent />
</ContentWithStickyCart>
```

## Использование

### Автоматическое использование

Если вы используете `StickyCartWrapper` в основном layout, отступы добавляются автоматически.

### Ручное использование

Для экранов, где нужен контроль над отступами:

```typescript
import { ContentWithStickyCart } from '../src/shared';

const MyScreen = () => {
  return (
    <ContentWithStickyCart>
      <ScrollView>{/* Ваш контент */}</ScrollView>
    </ContentWithStickyCart>
  );
};
```

### Прямое использование контекста

```typescript
import { useStickyCartContext } from '../src/shared';

const MyComponent = () => {
  const { cartHeight, isVisible } = useStickyCartContext();

  return (
    <View style={{ paddingBottom: isVisible ? cartHeight : 0 }}>
      {/* Ваш контент */}
    </View>
  );
};
```

## Преимущества

1. **Автоматические отступы**: Контент автоматически получает правильные отступы
2. **Динамическая высота**: Отступы адаптируются к реальной высоте корзины
3. **Sticky поведение**: Корзина остаётся прилипшей к низу экрана
4. **Обратная совместимость**: Существующий код продолжает работать
5. **Гибкость**: Можно использовать как автоматически, так и вручную

## Технические детали

- Использует `onLayout` для измерения высоты корзины
- Контекст синхронизирует состояние между компонентами
- Анимации сохранены для плавного появления/исчезновения
- Поддерживает компактный режим

## Миграция

Для существующих экранов миграция не требуется - отступы добавляются автоматически.

Для новых экранов рекомендуется использовать `ContentWithStickyCart` для явного контроля.
