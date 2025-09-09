import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '../src/auth/contexts';
import ThemeProvider from '../src/shared/contexts/ThemeContext';
import { useColors } from '../src/shared/hooks/useColors';
import CoffeeFlowThemeProvider from '../src/shared/theme/ThemeProvider';

const LayoutStack = () => {
  const colors = useColors();
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ThemeProvider>
          <CoffeeFlowThemeProvider>
            <AuthProvider>
              <LayoutStack />
            </AuthProvider>
          </CoffeeFlowThemeProvider>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
