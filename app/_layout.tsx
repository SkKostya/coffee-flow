import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GeneralInitializer } from '../src/general';
import { useColors } from '../src/shared/hooks/useColors';
import CoffeeFlowThemeProvider from '../src/shared/theme/ThemeProvider';
import { ReduxProvider } from '../src/store';

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
        <ReduxProvider>
          <CoffeeFlowThemeProvider>
            <GeneralInitializer>
              <LayoutStack />
            </GeneralInitializer>
          </CoffeeFlowThemeProvider>
        </ReduxProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
