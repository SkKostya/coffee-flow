# Интеграция геолокации

## Обзор

Добавлена поддержка получения и сохранения геопозиции пользователя в глобальном состоянии. Геолокация автоматически запрашивается при инициализации приложения.

## Структура данных

### UserLocation

```typescript
interface UserLocation {
  latitude: number; // Широта
  longitude: number; // Долгота
  accuracy: number | null; // Точность в метрах
  timestamp: number; // Время получения позиции
}
```

### UserData

```typescript
interface UserData {
  location: UserLocation | null; // Геопозиция пользователя
  selectedCity: City | null; // Выбранный город
}
```

### GeneralState

```typescript
interface GeneralState {
  categories: Category[];
  cities: City[];
  user: UserData; // ← Группировка пользовательских данных
  isLoading: boolean;
  error: string | null;
}
```

## Использование

### 1. Хук useGeneral

```typescript
import { useGeneral } from '../src/store';

const MyComponent = () => {
  const {
    user, // Все пользовательские данные
    userLocation, // Геопозиция пользователя
    userLocationInfo, // Информация о геопозиции
    userInfo, // Полная информация о пользователе
    setLocation, // Установить геопозицию
    clearLocation, // Очистить геопозицию
  } = useGeneral();

  return (
    <View>
      <Text>Широта: {userLocationInfo.latitude}</Text>
      <Text>Долгота: {userLocationInfo.longitude}</Text>
      <Text>Точность: {userLocationInfo.accuracy}м</Text>
    </View>
  );
};
```

### 2. Хук useLocation

```typescript
import { useLocation } from '../src/shared/hooks/useLocation';

const LocationComponent = () => {
  const {
    location,
    isLoading,
    error,
    requestLocation,
    getCurrentLocation,
    clearLocation,
  } = useLocation({
    onLocationUpdate: (location) => {
      console.log('Новая позиция:', location);
    },
    onError: (error) => {
      console.error('Ошибка геолокации:', error);
    },
  });

  const handleGetLocation = async () => {
    await requestLocation();
  };

  return (
    <View>
      <Button title="Получить позицию" onPress={handleGetLocation} />
      {isLoading && <Text>Получение позиции...</Text>}
      {error && <Text>Ошибка: {error}</Text>}
    </View>
  );
};
```

## Селекторы

### Базовые селекторы

- `selectUser` - все пользовательские данные
- `selectUserLocation` - геопозиция пользователя
- `selectUserLocationInfo` - информация о геопозиции

### selectUserLocationInfo

```typescript
{
  hasLocation: boolean; // Есть ли геопозиция
  latitude: number | null; // Широта
  longitude: number | null; // Долгота
  accuracy: number | null; // Точность в метрах
  timestamp: number | null; // Время получения
}
```

### selectUserInfo

```typescript
{
  location: UserLocation | null;
  selectedCity: City | null;
  selectedCityInfo: {...};
  locationInfo: {...};
}
```

## Действия

### setUserLocation

```typescript
dispatch(setUserLocation(location)); // Установить геопозицию
dispatch(setUserLocation(null)); // Очистить геопозицию
```

## Автоматическая инициализация

При запуске приложения `GeneralInitializer`:

1. Загружает категории и города
2. Автоматически запрашивает геопозицию пользователя
3. Сохраняет полученную позицию в глобальное состояние

## Разрешения

### Android

В `android/app/src/main/AndroidManifest.xml` уже добавлены:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### iOS

Для iOS нужно добавить в `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Приложению нужен доступ к геолокации для поиска ближайших кофеен"
      }
    }
  }
}
```

## Примеры использования

### 1. Отображение текущей позиции

```typescript
const LocationDisplay = () => {
  const { userLocationInfo } = useGeneral();

  if (!userLocationInfo.hasLocation) {
    return <Text>Позиция не определена</Text>;
  }

  return (
    <View>
      <Text>Ваша позиция:</Text>
      <Text>Широта: {userLocationInfo.latitude}</Text>
      <Text>Долгота: {userLocationInfo.longitude}</Text>
      <Text>Точность: {userLocationInfo.accuracy}м</Text>
    </View>
  );
};
```

### 2. Поиск ближайших кофеен

```typescript
const NearestCoffeeShops = () => {
  const { userLocation } = useGeneral();
  const { coffeeShops } = useCoffeeShops();

  const nearestShops = useMemo(() => {
    if (!userLocation) return [];

    return coffeeShops
      .map((shop) => ({
        ...shop,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          parseFloat(shop.latitude),
          parseFloat(shop.longitude)
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [coffeeShops, userLocation]);

  return <CoffeeShopsList shops={nearestShops} />;
};
```

### 3. Проверка доступности геолокации

```typescript
const LocationButton = () => {
  const { userLocationInfo } = useGeneral();
  const { requestLocation } = useLocation();

  return (
    <Button
      title={
        userLocationInfo.hasLocation ? 'Обновить позицию' : 'Получить позицию'
      }
      onPress={requestLocation}
    />
  );
};
```

## Обработка ошибок

### Типичные ошибки

1. **Разрешение отклонено** - пользователь не дал разрешение на геолокацию
2. **Геолокация отключена** - GPS отключен в настройках устройства
3. **Таймаут** - не удалось получить позицию за отведенное время
4. **Нет сигнала** - слабый GPS сигнал (в помещении)

### Обработка в коде

```typescript
const { getCurrentLocation } = useLocation({
  onError: (error) => {
    if (error.includes('разрешение')) {
      Alert.alert(
        'Разрешение',
        'Для работы приложения нужен доступ к геолокации'
      );
    } else if (error.includes('отключена')) {
      Alert.alert('Геолокация', 'Включите геолокацию в настройках устройства');
    } else {
      Alert.alert('Ошибка', 'Не удалось определить вашу позицию');
    }
  },
});
```

## Производительность

### Оптимизации

1. **Кэширование** - геопозиция сохраняется в Redux store
2. **Мемоизация** - селекторы используют `createSelector`
3. **Ленивая загрузка** - геолокация запрашивается только при необходимости

### Рекомендации

- Не запрашивайте геолокацию слишком часто
- Используйте `getCurrentLocation` для разовых запросов
- Кэшируйте результаты расчетов расстояний

## Troubleshooting

### Геолокация не работает

1. Проверьте разрешения в настройках приложения
2. Убедитесь, что GPS включен
3. Проверьте, что приложение имеет доступ к геолокации

### Неточная позиция

1. Используйте `Location.Accuracy.High` для максимальной точности
2. Учитывайте, что в помещении точность может быть низкой
3. Проверьте `accuracy` в `UserLocation`

### Ошибки типизации

- Убедитесь, что импортируете типы из `src/general/types`
- Проверьте, что используете правильные селекторы
- Убедитесь, что `expo-location` установлен

## Безопасность

### Конфиденциальность

- Геолокация запрашивается только при необходимости
- Данные не передаются третьим лицам
- Пользователь может отключить геолокацию в любой момент

### Рекомендации

- Запрашивайте разрешение с понятным объяснением
- Предоставляйте возможность отключить геолокацию
- Не сохраняйте точные координаты без необходимости
