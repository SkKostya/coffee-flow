# Глобальное состояние выбранного города

## Обзор

Теперь выбранный город сохраняется в глобальном Redux состоянии и доступен во всем приложении. Это позволяет:

- Сохранять выбор города между экранами
- Использовать выбранный город в любом компоненте
- Автоматически инициализировать город при запуске приложения

## Структура состояния

### GeneralState

```typescript
interface GeneralState {
  categories: Category[];
  cities: City[];
  user: UserData; // ← Группировка пользовательских данных
  isLoading: boolean;
  error: string | null;
}

interface UserData {
  location: UserLocation | null; // Геопозиция пользователя
  selectedCity: City | null; // Выбранный город
}
```

### City

```typescript
interface City {
  id: string;
  name: string;
  nameRu: string;
  latitude: string;
  longitude: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Использование

### 1. Хук useGeneral

```typescript
import { useGeneral } from '../src/store';

const MyComponent = () => {
  const {
    selectedCity, // Выбранный город
    selectedCityInfo, // Информация о выбранном городе
    cities, // Все города
    selectCity, // Функция выбора города
    clearSelectedCity, // Функция очистки выбора
    loadCities, // Загрузка городов
  } = useGeneral();

  // Использование
  const handleCitySelect = (city: City) => {
    selectCity(city);
  };

  return (
    <View>
      <Text>Выбранный город: {selectedCityInfo.selectedCityName}</Text>
      <Button title="Очистить выбор" onPress={clearSelectedCity} />
    </View>
  );
};
```

### 2. Селекторы

```typescript
import {
  selectSelectedCity,
  selectSelectedCityInfo,
} from '../src/store/selectors/generalSelectors';

// В компоненте
const selectedCity = useAppSelector(selectSelectedCity);
const cityInfo = useAppSelector(selectSelectedCityInfo);
```

### 3. Прямое использование в city-selection.tsx

```typescript
// app/city-selection.tsx
const { cities, isLoading, error, loadCities, selectCity } = useGeneral();

const handleCitySelect = useCallback(
  (city: City) => {
    // Сохраняем в глобальное состояние
    selectCity(city);

    // Переходим на нужный экран
    router.navigate({
      pathname: returnTo as any,
      params: {
        selectedCityId: city.id,
        selectedCityName: city.nameRu || city.name,
      },
    });
  },
  [returnTo, selectCity]
);
```

## Селекторы

### Базовые селекторы

- `selectSelectedCity` - выбранный город
- `selectSelectedCityInfo` - информация о выбранном городе

### selectSelectedCityInfo

Возвращает объект с информацией:

```typescript
{
  hasSelectedCity: boolean; // Есть ли выбранный город
  selectedCityName: string; // Название города на русском
  selectedCityId: string | null; // ID города
}
```

## Действия

### setSelectedCity

```typescript
dispatch(setSelectedCity(city)); // Выбрать город
dispatch(setSelectedCity(null)); // Очистить выбор
```

## Автоматическая инициализация

При загрузке приложения:

1. Загружаются все доступные города
2. Если есть сохраненный город - он выбирается
3. Если нет сохраненного города - выбирается первый активный

## Интеграция с существующими хуками

### useCitySelection

Хук `useCitySelection` теперь использует глобальное состояние:

- `selectedCity` берется из Redux store
- `selectCity` обновляет глобальное состояние
- Автоматическая синхронизация между компонентами

## Примеры использования

### 1. Отображение выбранного города в заголовке

```typescript
const Header = () => {
  const { selectedCityInfo } = useGeneral();

  return (
    <View>
      <Text>{selectedCityInfo.selectedCityName}</Text>
    </View>
  );
};
```

### 2. Фильтрация данных по городу

```typescript
const CoffeeShopsList = () => {
  const { selectedCity } = useGeneral();
  const { coffeeShops } = useCoffeeShops();

  const filteredShops = useMemo(() => {
    if (!selectedCity) return [];
    return coffeeShops.filter((shop) => shop.cityId === selectedCity.id);
  }, [coffeeShops, selectedCity]);

  return <CoffeeShopsList shops={filteredShops} />;
};
```

### 3. Проверка выбора города

```typescript
const CheckoutButton = () => {
  const { selectedCityInfo } = useGeneral();

  return (
    <Button
      title="Оформить заказ"
      disabled={!selectedCityInfo.hasSelectedCity}
      onPress={handleCheckout}
    />
  );
};
```

## Миграция

Если у вас есть компоненты, которые используют локальное состояние для выбранного города:

### Было:

```typescript
const [selectedCity, setSelectedCity] = useState<City | null>(null);
```

### Стало:

```typescript
const { selectedCity, selectCity } = useGeneral();
```

## Преимущества

1. **Централизованное состояние** - один источник истины
2. **Автоматическая синхронизация** - изменения отражаются везде
3. **Персистентность** - выбор сохраняется между сессиями
4. **Типизация** - полная TypeScript поддержка
5. **Производительность** - мемоизированные селекторы

## Troubleshooting

### Город не сохраняется

- Убедитесь, что используете `selectCity` из `useGeneral`
- Проверьте, что Redux store правильно настроен

### Город не отображается

- Проверьте, что `selectedCity` не `null`
- Используйте `selectedCityInfo.selectedCityName` для отображения

### Ошибки типизации

- Убедитесь, что импортируете типы из `src/general/types`
- Проверьте, что используете правильные селекторы
