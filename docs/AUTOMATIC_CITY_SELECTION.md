# Автоматический выбор города

## Обзор

Реализована система автоматического выбора города на основе геопозиции пользователя. Если геопозиция недоступна, используется fallback на город 'Almaty'.

## Логика работы

### 1. Приоритеты выбора города

1. **По геопозиции** - если доступна геопозиция пользователя, выбирается ближайший активный город
2. **Fallback** - если геопозиция недоступна, выбирается город с именем 'Almaty'
3. **Сохранение выбора** - если город уже выбран пользователем, автоматический выбор не происходит

### 2. Алгоритм выбора

```typescript
// 1. Проверяем, есть ли уже выбранный город
if (selectedCity) return; // Не меняем существующий выбор

// 2. Проверяем доступность городов
if (cities.length === 0) return;

// 3. Если есть геопозиция - ищем ближайший город
if (userLocation) {
  const nearestCity = findNearestCity(userLocation, cities);
  if (nearestCity) return nearestCity;
}

// 4. Fallback на город по имени
return findCityByName(cities, 'Almaty');
```

## Компоненты

### 1. Утилиты геолокации (`src/shared/helpers/locationUtils.ts`)

#### `calculateDistance`

Вычисляет расстояние между двумя точками по формуле гаверсинуса.

```typescript
const distance = calculateDistance(
  userLat,
  userLon, // Координаты пользователя
  cityLat,
  cityLon // Координаты города
);
// Возвращает расстояние в километрах
```

#### `findNearestCity`

Находит ближайший активный город к геопозиции пользователя.

```typescript
const nearestCity = findNearestCity(userLocation, cities);
```

#### `findCityByName`

Находит город по имени (для fallback).

```typescript
const city = findCityByName(cities, 'Almaty');
```

#### `selectDefaultCity`

Основная функция выбора города по умолчанию.

```typescript
const defaultCity = selectDefaultCity(
  userLocation, // Геопозиция пользователя (может быть null)
  cities, // Список городов
  'Almaty' // Fallback город
);
```

### 2. Хук автоматического выбора (`src/shared/hooks/useCitySelection.ts`)

```typescript
useCitySelection({
  userLocation, // Геопозиция пользователя
  cities, // Список городов
  selectedCity, // Текущий выбранный город
  onCitySelect, // Функция выбора города
  fallbackCityName: 'Almaty', // Fallback город
});
```

### 3. Интеграция в GeneralInitializer

```typescript
const GeneralInitializer = () => {
  const { cities, selectedCity, selectCity } = useGeneral();
  const { location } = useLocation();

  // Автоматический выбор города
  useCitySelection({
    userLocation: location,
    cities,
    selectedCity,
    onCitySelect: selectCity,
    fallbackCityName: 'Almaty',
  });

  // ... остальная логика
};
```

## Примеры использования

### 1. Ручной выбор города

```typescript
const CitySelector = () => {
  const { cities, selectedCity, selectCity } = useGeneral();
  const { userLocation } = useGeneral();

  const handleCitySelect = (city: City) => {
    selectCity(city); // Ручной выбор перезаписывает автоматический
  };

  return (
    <View>
      <Text>Выбранный город: {selectedCity?.nameRu}</Text>
      <Text>
        Ваша позиция: {userLocation?.latitude}, {userLocation?.longitude}
      </Text>
      {/* Список городов для выбора */}
    </View>
  );
};
```

### 2. Проверка автоматического выбора

```typescript
const CityStatus = () => {
  const { selectedCity, userLocationInfo } = useGeneral();

  return (
    <View>
      <Text>Город: {selectedCity?.nameRu || 'Не выбран'}</Text>
      <Text>
        Геопозиция: {userLocationInfo.hasLocation ? 'Доступна' : 'Недоступна'}
      </Text>
      {!userLocationInfo.hasLocation && (
        <Text>Используется fallback: Almaty</Text>
      )}
    </View>
  );
};
```

### 3. Отладка выбора города

```typescript
const CityDebug = () => {
  const { cities, selectedCity, userLocation } = useGeneral();

  const debugInfo = useMemo(() => {
    if (!userLocation || !selectedCity) return null;

    const cityLat = parseFloat(selectedCity.latitude);
    const cityLon = parseFloat(selectedCity.longitude);

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      cityLat,
      cityLon
    );

    return {
      distance: distance.toFixed(2),
      isInRadius: distance <= 50, // 50км радиус
    };
  }, [userLocation, selectedCity]);

  return (
    <View>
      <Text>Расстояние до города: {debugInfo?.distance}км</Text>
      <Text>В радиусе города: {debugInfo?.isInRadius ? 'Да' : 'Нет'}</Text>
    </View>
  );
};
```

## Настройка

### 1. Изменение fallback города

```typescript
// В GeneralInitializer
useCitySelection({
  userLocation: location,
  cities,
  selectedCity,
  onCitySelect: selectCity,
  fallbackCityName: 'Nur-Sultan', // Изменить fallback город
});
```

### 2. Настройка радиуса поиска

```typescript
// В locationUtils.ts можно изменить логику поиска
const findNearestCity = (userLocation, cities, maxRadius = 100) => {
  // Поиск только в пределах maxRadius километров
  // ...
};
```

### 3. Добавление дополнительных критериев

```typescript
const selectDefaultCity = (userLocation, cities, fallbackCityName) => {
  // 1. Проверяем геопозицию
  if (userLocation) {
    const nearestCity = findNearestCity(userLocation, cities);
    if (nearestCity) return nearestCity;
  }

  // 2. Проверяем сохраненный выбор пользователя
  const savedCity = getSavedCityPreference();
  if (savedCity) return savedCity;

  // 3. Fallback
  return findCityByName(cities, fallbackCityName);
};
```

## Обработка ошибок

### 1. Нет доступных городов

```typescript
if (cities.length === 0) {
  console.warn('Нет доступных городов для выбора');
  return null;
}
```

### 2. Некорректные координаты города

```typescript
const cityLat = parseFloat(city.latitude);
const cityLon = parseFloat(city.longitude);

if (isNaN(cityLat) || isNaN(cityLon)) {
  console.warn(`Некорректные координаты для города ${city.name}`);
  return; // Пропускаем этот город
}
```

### 3. Ошибка геолокации

```typescript
const { getCurrentLocation } = useLocation({
  onError: (error) => {
    console.warn('Ошибка геолокации, используется fallback город');
    // Автоматически сработает fallback на 'Almaty'
  },
});
```

## Производительность

### 1. Мемоизация расчетов

```typescript
const nearestCity = useMemo(() => {
  if (!userLocation || cities.length === 0) return null;
  return findNearestCity(userLocation, cities);
}, [userLocation, cities]);
```

### 2. Кэширование расстояний

```typescript
const cityDistances = useMemo(() => {
  return cities.map((city) => ({
    ...city,
    distance: calculateDistance(userLat, userLon, cityLat, cityLon),
  }));
}, [cities, userLat, userLon]);
```

## Тестирование

### 1. Тест с геопозицией

```typescript
const mockUserLocation = {
  latitude: 43.222,
  longitude: 76.8512,
  accuracy: 10,
  timestamp: Date.now(),
};

const mockCities = [
  {
    id: '1',
    name: 'Almaty',
    latitude: '43.2220',
    longitude: '76.8512',
    isActive: true,
  },
  {
    id: '2',
    name: 'Nur-Sultan',
    latitude: '51.1694',
    longitude: '71.4491',
    isActive: true,
  },
];

const result = selectDefaultCity(mockUserLocation, mockCities);
expect(result?.name).toBe('Almaty'); // Ближайший город
```

### 2. Тест без геопозиции

```typescript
const result = selectDefaultCity(null, mockCities);
expect(result?.name).toBe('Almaty'); // Fallback город
```

### 3. Тест с уже выбранным городом

```typescript
const selectedCity = { id: '2', name: 'Nur-Sultan' };
// Автоматический выбор не должен происходить
```

## Troubleshooting

### Город не выбирается автоматически

1. Проверьте, что `cities` загружены
2. Убедитесь, что есть активные города
3. Проверьте, что `selectedCity` изначально `null`

### Выбирается неправильный город

1. Проверьте координаты городов в базе данных
2. Убедитесь, что геопозиция корректная
3. Проверьте логику расчета расстояний

### Fallback не работает

1. Убедитесь, что есть город с именем 'Almaty'
2. Проверьте, что город активен (`isActive: true`)
3. Проверьте регистр имени города
