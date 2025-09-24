# Настройка Google Maps API для Android

## Шаги настройки

### 1. Создайте файл .env в корне проекта

Создайте файл `.env` в корне проекта (рядом с `package.json`) со следующим содержимым:

```env
# Google Maps API Key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
```

### 2. Получите API ключ от Google

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите следующие API:
   - Maps SDK for Android
   - Places API (если нужен)
   - Geocoding API (если нужен)
4. Перейдите в "Credentials" и создайте новый API ключ
5. Ограничьте ключ для Android приложений:
   - Выберите "Android apps"
   - Добавьте package name: `com.anonymous.coffeeflow`
   - Добавьте SHA-1 fingerprint (см. ниже)

### 3. Получите SHA-1 fingerprint

Для debug версии:

```bash
cd android
./gradlew signingReport
```

Ищите строку вида:

```
SHA1: XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX
```

### 4. Настройка завершена

После создания файла `.env` с правильным API ключом:

1. Пересоберите проект:

   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx expo run:android
   ```

2. Или используйте Expo CLI:
   ```bash
   npx expo start
   ```

## Проверка работы

API ключ будет автоматически подставлен в `AndroidManifest.xml` в мета-тег:

```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="${EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}"/>
```

## Безопасность

⚠️ **Важно**:

- Никогда не коммитьте файл `.env` в git
- Убедитесь, что `.env` добавлен в `.gitignore`
- Ограничьте API ключ только для вашего приложения в Google Cloud Console

## Troubleshooting

Если карты не загружаются:

1. Проверьте, что API ключ правильно установлен в `.env`
2. Убедитесь, что SHA-1 fingerprint добавлен в Google Cloud Console
3. Проверьте, что включены нужные API в Google Cloud Console
4. Проверьте логи Android Studio на наличие ошибок
