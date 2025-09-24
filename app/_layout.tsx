import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-screens/gesture-handler';
import Toast from 'react-native-toast-message';
import { GeneralInitializer } from '../src/general';
import {
  AuthInitializer,
  AuthRedirectProvider,
  PathTracker,
  StickyCartProvider,
  StickyCartWrapper,
  toastConfig,
} from '../src/shared';
import { useColors } from '../src/shared/hooks/useColors';
import CoffeeFlowThemeProvider from '../src/shared/theme/ThemeProvider';
import { ReduxProvider } from '../src/store';

// блокируем автоскрытие заставки сразу
SplashScreen.preventAutoHideAsync();

// Инициализируем react-native-screens
import { enableScreens } from 'react-native-screens';
enableScreens();

const LayoutStack = () => {
  const colors = useColors();

  useEffect(() => {
    async function prepare() {
      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.backgrounds.primary,
        },
        headerTintColor: colors.texts.primary,
      }}
    />
  );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ReduxProvider>
            <CoffeeFlowThemeProvider>
              <AuthInitializer>
                <AuthRedirectProvider>
                  <StickyCartProvider>
                    <GeneralInitializer>
                      <PathTracker />
                      <LayoutStack />
                      <Toast config={toastConfig} />
                      <StickyCartWrapper />
                    </GeneralInitializer>
                  </StickyCartProvider>
                </AuthRedirectProvider>
              </AuthInitializer>
            </CoffeeFlowThemeProvider>
          </ReduxProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
