# Экран выбора города

## Описание

Экран выбора города позволяет пользователям выбирать город для поиска кофеен. Реализован с использованием React Native Elements и следует архитектурным принципам проекта Coffee Flow.

## Файлы

### Основные файлы

- `app/city-selection.tsx` - Экран выбора города
- `src/types/city.ts` - Типы для работы с городами
- `src/shared/hooks/useCitySelection.ts` - Хук для управления выбором города
- `src/shared/components/CitySelector.tsx` - Компонент селектора города

### Интеграция

- `app/(tabs)/coffee-shops.tsx` - Интегрирован селектор города
- `app/index.tsx` - Добавлена ссылка на демонстрацию

## Функциональность

### Основные возможности

1. **Поиск городов** - Поиск по названию города, региону или английскому названию
2. **Список городов** - Отображение всех доступных городов Казахстана
3. **Выбор города** - Выбор города с визуальной индикацией
4. **Навигация** - Возврат к предыдущему экрану с передачей выбранного города

### Города

Включены основные города Казахстана:

- Алматы (по умолчанию)
- Астана
- Атырау
- Тараз
- Костанай
- Талдыкорган
- Шымкент
- Павлодар
- Семей
- Актобе
- Актау
- Петропавловск
- Уральск
- Кызылорда
- Усть-Каменогорск

## Использование

### Базовое использование

```typescript
import { useCitySelection } from '../src/shared/hooks/useCitySelection';
import { CitySelector } from '../src/shared/components';

const MyScreen = () => {
  const { selectedCity, selectCity } = useCitySelection({
    initialCityId: 'almaty',
  });

  const handleCitySelect = () => {
    router.navigate({
      pathname: '/city-selection',
      params: {
        selectedCityId: selectedCity?.id,
        returnTo: '/my-screen',
      },
    });
  };

  return (
    <CitySelector selectedCity={selectedCity} onPress={handleCitySelect} />
  );
};
```

### Навигация к экрану выбора

```typescript
// Переход к экрану выбора города
router.navigate({
  pathname: '/city-selection',
  params: {
    selectedCityId: 'current-city-id',
    returnTo: '/return-path',
  },
});

// Получение выбранного города
const params = useLocalSearchParams();
const selectedCityId = params.selectedCityId as string;
```

### Хук useCitySelection

```typescript
interface UseCitySelectionParams {
  initialCityId?: string;
  onCityChange?: (city: City | null) => void;
}

const {
  selectedCity, // Выбранный город
  availableCities, // Доступные города (с фильтрацией)
  searchQuery, // Поисковый запрос
  isLoading, // Состояние загрузки
  error, // Ошибка
  selectCity, // Функция выбора города
  searchCities, // Функция поиска
  clearSearch, // Очистка поиска
  loadCities, // Загрузка городов
} = useCitySelection({
  initialCityId: 'almaty',
  onCityChange: (city) => console.log('Выбран город:', city),
});
```

## Компоненты

### CitySelector

Компонент для отображения выбранного города с возможностью перехода к выбору.

```typescript
interface CitySelectorProps {
  selectedCity: City | null;
  onPress: () => void;
  placeholder?: string;
  disabled?: boolean;
  style?: any;
}
```

### Экран выбора города

Полнофункциональный экран с:

- Поиском городов
- Списком с фильтрацией
- Навигацией
- Обработкой выбора

## Стилизация

Все компоненты используют цветовую систему Coffee Flow:

- `colors.backgrounds.primary` - Основной фон
- `colors.backgrounds.elevated` - Фон карточек
- `colors.texts.primary` - Основной текст
- `colors.texts.secondary` - Вторичный текст
- `colors.primary.main` - Акцентный цвет
- `colors.borders.primary` - Границы

## Адаптивность

Компоненты адаптированы для:

- Мобильных устройств (основной фокус)
- Планшетов
- Различных размеров экранов

## Тестирование

Для тестирования используйте демонстрационный экран:

1. Перейдите на главную страницу
2. Нажмите "Выбор города"
3. Протестируйте поиск и выбор города
4. Проверьте навигацию

## Интеграция с другими экранами

Экран выбора города интегрирован в:

- Экран кофеен (`coffee-shops.tsx`)

Для интеграции в другие экраны:

1. Импортируйте хук `useCitySelection`
2. Импортируйте компонент `CitySelector`
3. Добавьте навигацию к экрану выбора города
4. Обработайте возврат с выбранным городом

## Будущие улучшения

1. **API интеграция** - Загрузка городов с сервера
2. **Геолокация** - Автоматическое определение города
3. **Избранные города** - Сохранение часто выбираемых городов
4. **Кэширование** - Кэширование списка городов
5. **Анимации** - Плавные переходы и анимации
