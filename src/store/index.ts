import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

// Импорты слайсов
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import themeReducer from './slices/themeSlice';

// Конфигурация Redux Persist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'theme'], // Сохраняем только auth и theme
  blacklist: ['profile'], // Не сохраняем profile (загружается с сервера)
};

// Корневой редьюсер
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  theme: themeReducer,
});

// Персистентный редьюсер
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Настройка store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: __DEV__, // Включаем devtools только в development
});

// Создание persistor для Redux Persist
export const persistor = persistStore(store);

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Экспорт хуков и провайдера
export { useAppDispatch, useAppSelector } from './hooks';
export { default as ReduxProvider } from './ReduxProvider';

// Экспорт всех хуков
export * from './hooks/useAppInitialization';
export * from './hooks/useAuth';
export * from './hooks/useProfile';
export * from './hooks/useTheme';

// Экспорт селекторов
export * from './selectors';

// Экспорт слайсов
export * from './slices';
