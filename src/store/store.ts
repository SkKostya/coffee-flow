import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

// Импорты слайсов
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import coffeeShopsReducer from './slices/coffeeShopsSlice';
import favoritesReducer from './slices/favoritesSlice';
import generalReducer from './slices/generalSlice';
import ordersReducer from './slices/ordersSlice';
import paymentMethodsReducer from './slices/paymentMethodsSlice';
import productsReducer from './slices/productsSlice';
import profileReducer from './slices/profileSlice';
import stickyCartReducer from './slices/stickyCartSlice';
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
  cart: cartReducer,
  coffeeShops: coffeeShopsReducer,
  favorites: favoritesReducer,
  general: generalReducer,
  orders: ordersReducer,
  paymentMethods: paymentMethodsReducer,
  products: productsReducer,
  profile: profileReducer,
  stickyCart: stickyCartReducer,
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
