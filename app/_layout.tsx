import { Stack } from 'expo-router';
import ThemeProvider from '../src/shared/contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
