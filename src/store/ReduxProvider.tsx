import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppInitializer from './AppInitializer';
import { persistor, store } from './store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null} // Можно добавить Loading компонент
        persistor={persistor}
      >
        <AppInitializer>{children}</AppInitializer>
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
