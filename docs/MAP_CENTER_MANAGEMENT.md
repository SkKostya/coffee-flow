# Управление центром карты

## Обзор

Реализована система автоматического управления центром карты на основе геопозиции пользователя или выбранного города. Карта автоматически центрируется при изменении данных и предоставляет кнопки для ручного управления.

## Логика работы

### 1. Приоритеты центрирования

1. **Геопозиция пользователя** - если доступна, карта центрируется на текущей позиции
2. **Выбранный город** - если геопозиция недоступна, центрируется на выбранном городе
3. **Fallback** - если нет данных, используется статический центр (Алматы)

### 2. Уровни зума

- **BUILDING** - 0.005° (здание)
- **STREET** - 0.01° (улица)
- **NEIGHBORHOOD** - 0.02° (район) - по умолчанию для геопозиции
- **DISTRICT** - 0.05° (округ)
- **CITY** - 0.1° (город) - по умолчанию для города

## Компоненты

### 1. Утилиты карты (`src/shared/helpers/mapUtils.ts`)

#### `createRegionFromUserLocation`

Создает регион карты на основе геопозиции пользователя.

```typescript
const region = createRegionFromUserLocation(
  userLocation,
  'NEIGHBORHOOD' // Уровень зума
);
```

#### `createRegionFromCity`

Создает регион карты на основе выбранного города.

```typescript
const region = createRegionFromCity(
  city,
  'CITY' // Уровень зума
);
```

#### `createOptimalMapRegion`

Основная функция выбора оптимального региона с приоритетом геопозиции.

```typescript
const region = createOptimalMapRegion(
  userLocation, // Геопозиция (может быть null)
  selectedCity, // Выбранный город (может быть null)
  'NEIGHBORHOOD', // Зум для геопозиции
  'CITY' // Зум для города
);
```

#### `createRegionWithRadius`

Создает регион с учетом радиуса поиска.

```typescript
const region = createRegionWithRadius(
  centerLat,
  centerLon, // Центр
  radiusKm // Радиус в километрах
);
```

### 2. Хук управления картой (`src/shared/hooks/useMapCenter.ts`)

```typescript
const {
  mapRegion, // Текущий регион карты
  isRegionReady, // Готов ли регион
  centerOnUserLocation, // Центрировать на геопозиции
  centerOnCity, // Центрировать на городе
  centerOnRadius, // Центрировать с радиусом
  hasUserLocation, // Есть ли геопозиция
  hasSelectedCity, // Есть ли выбранный город
} = useMapCenter({
  userLocation,
  selectedCity,
  searchRadius: 1,
  userZoomLevel: 'NEIGHBORHOOD',
  cityZoomLevel: 'CITY',
  onRegionChange: (region) => {
    console.log('Регион карты изменился:', region);
  },
});
```

### 3. Интеграция в компонент кофеен

```typescript
// В app/(tabs)/coffee-shops.tsx
const {
  mapRegion,
  centerOnUserLocation,
  centerOnCity,
  centerOnRadius,
  hasUserLocation,
  hasSelectedCity,
} = useMapCenter({
  userLocation,
  selectedCity,
  searchRadius: parseInt(selectedRadius.replace(' км', '')),
  userZoomLevel: 'NEIGHBORHOOD',
  cityZoomLevel: 'CITY',
});

// Карта с динамическим регионом
<MapView
  region={mapRegion || fallbackRegion}
  // ... остальные пропсы
>
  {/* Кнопки управления */}
  <View style={styles.mapControls}>
    {hasUserLocation && (
      <TouchableOpacity onPress={centerOnUserLocation}>
        <Ionicons name="locate" />
      </TouchableOpacity>
    )}
    {hasSelectedCity && (
      <TouchableOpacity onPress={centerOnCity}>
        <Ionicons name="business" />
      </TouchableOpacity>
    )}
    <TouchableOpacity onPress={() => centerOnRadius(radius)}>
      <Ionicons name="search" />
    </TouchableOpacity>
  </View>
</MapView>;
```

## Примеры использования

### 1. Автоматическое центрирование

```typescript
const MapComponent = () => {
  const { userLocation, selectedCity } = useGeneral();

  const { mapRegion } = useMapCenter({
    userLocation,
    selectedCity,
    userZoomLevel: 'NEIGHBORHOOD',
    cityZoomLevel: 'CITY',
  });

  return <MapView region={mapRegion}>{/* Маркеры */}</MapView>;
};
```

### 2. Ручное управление центром

```typescript
const MapControls = () => {
  const { userLocation, selectedCity } = useGeneral();

  const {
    centerOnUserLocation,
    centerOnCity,
    centerOnRadius,
    hasUserLocation,
    hasSelectedCity,
  } = useMapCenter({
    userLocation,
    selectedCity,
  });

  return (
    <View style={styles.controls}>
      {hasUserLocation && (
        <Button
          title="Моя позиция"
          onPress={centerOnUserLocation}
          icon="locate"
        />
      )}

      {hasSelectedCity && (
        <Button title="Центр города" onPress={centerOnCity} icon="business" />
      )}

      <Button
        title="Радиус поиска"
        onPress={() => centerOnRadius(5)}
        icon="search"
      />
    </View>
  );
};
```

### 3. Отслеживание изменений региона

```typescript
const MapWithTracking = () => {
  const [currentRegion, setCurrentRegion] = useState(null);

  const { mapRegion } = useMapCenter({
    userLocation,
    selectedCity,
    onRegionChange: (region) => {
      setCurrentRegion(region);
      console.log('Новый регион:', region);
    },
  });

  return (
    <View>
      <MapView region={mapRegion} />
      <Text>
        Центр: {currentRegion?.latitude}, {currentRegion?.longitude}
      </Text>
    </View>
  );
};
```

## Настройка

### 1. Изменение уровней зума

```typescript
const { mapRegion } = useMapCenter({
  userLocation,
  selectedCity,
  userZoomLevel: 'STREET', // Более детальный зум для геопозиции
  cityZoomLevel: 'DISTRICT', // Менее детальный зум для города
});
```

### 2. Настройка радиуса поиска

```typescript
const { mapRegion } = useMapCenter({
  userLocation,
  selectedCity,
  searchRadius: 10, // 10 км радиус
});
```

### 3. Кастомные уровни зума

```typescript
// В mapUtils.ts
export const CUSTOM_ZOOM_LEVELS = {
  VERY_CLOSE: { latitudeDelta: 0.001, longitudeDelta: 0.001 },
  CLOSE: { latitudeDelta: 0.005, longitudeDelta: 0.005 },
  // ... остальные уровни
};
```

## Обработка ошибок

### 1. Некорректные координаты города

```typescript
try {
  const region = createRegionFromCity(city);
} catch (error) {
  console.error('Ошибка координат города:', error.message);
  // Используем fallback регион
}
```

### 2. Отсутствие данных

```typescript
const { mapRegion, isRegionReady } = useMapCenter({
  userLocation,
  selectedCity,
});

if (!isRegionReady) {
  return <LoadingSpinner />;
}

return <MapView region={mapRegion} />;
```

### 3. Ошибки геолокации

```typescript
const { mapRegion } = useMapCenter({
  userLocation: null, // Геолокация недоступна
  selectedCity, // Используем город как fallback
});
```

## Производительность

### 1. Мемоизация регионов

```typescript
const optimalRegion = useMemo(() => {
  return createOptimalMapRegion(userLocation, selectedCity);
}, [userLocation, selectedCity]);
```

### 2. Дебаунсинг обновлений

```typescript
const debouncedRegionChange = useDebouncedCallback(
  (region) => {
    onRegionChange?.(region);
  },
  300 // 300ms задержка
);
```

### 3. Условное обновление

```typescript
useEffect(() => {
  // Обновляем только при значительных изменениях
  if (shouldUpdateRegion(userLocation, selectedCity)) {
    updateMapRegion();
  }
}, [userLocation, selectedCity]);
```

## Стилизация кнопок управления

### 1. Базовые стили

```typescript
const styles = StyleSheet.create({
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column',
    gap: 8,
  },
  mapControlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgrounds.neutral,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadows.medium,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
});
```

### 2. Адаптивные стили

```typescript
const mapControlButton = {
  ...baseStyles,
  ...(isDark ? darkThemeStyles : lightThemeStyles),
  ...(isPressed ? pressedStyles : {}),
};
```

## Тестирование

### 1. Тест автоматического центрирования

```typescript
const mockUserLocation = {
  latitude: 43.222,
  longitude: 76.8512,
  accuracy: 10,
  timestamp: Date.now(),
};

const { mapRegion } = useMapCenter({
  userLocation: mockUserLocation,
  selectedCity: null,
});

expect(mapRegion?.latitude).toBe(43.222);
expect(mapRegion?.longitude).toBe(76.8512);
```

### 2. Тест fallback на город

```typescript
const mockCity = {
  id: '1',
  name: 'Almaty',
  latitude: '43.2220',
  longitude: '76.8512',
  isActive: true,
};

const { mapRegion } = useMapCenter({
  userLocation: null,
  selectedCity: mockCity,
});

expect(mapRegion?.latitude).toBe(43.222);
```

### 3. Тест радиуса поиска

```typescript
const region = createRegionWithRadius(43.222, 76.8512, 5);
expect(region.latitudeDelta).toBeGreaterThan(0);
expect(region.longitudeDelta).toBeGreaterThan(0);
```

## Troubleshooting

### Карта не центрируется

1. Проверьте, что `mapRegion` не null
2. Убедитесь, что есть `userLocation` или `selectedCity`
3. Проверьте, что `isRegionReady` равно true

### Неправильный зум

1. Проверьте уровни зума в `MAP_ZOOM_LEVELS`
2. Убедитесь, что используете правильные параметры
3. Проверьте, что радиус поиска корректный

### Кнопки не работают

1. Проверьте, что `hasUserLocation` и `hasSelectedCity` корректные
2. Убедитесь, что функции `centerOn*` вызываются
3. Проверьте, что `onRegionChange` работает

### Производительность

1. Используйте мемоизацию для тяжелых вычислений
2. Дебаунсите обновления региона
3. Проверьте, что не происходит лишних перерендеров
