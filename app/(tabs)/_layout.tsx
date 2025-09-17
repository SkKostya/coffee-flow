import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColors } from '../../src/shared/hooks/useColors';

export default function TabsLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          borderTopWidth: 2,
          borderColor: colors.borders.subtle,
          backgroundColor: colors.backgrounds.neutral,
          height: 80,
          paddingBottom: 18,
        },
        tabBarActiveTintColor: colors.primary.main,
        headerStyle: {
          backgroundColor: colors.backgrounds.neutral,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: colors.texts.primary,
        },
        headerTintColor: colors.texts.primary,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';

          if (route.name === 'coffee-shops') iconName = 'cafe-outline';
          if (route.name === 'favorites') iconName = 'heart-outline';
          if (route.name === 'profile') iconName = 'person-outline';
          if (route.name === 'cart') iconName = 'cart-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tabs.Screen
        name="coffee-shops"
        options={{ title: 'Кофейни', headerShown: false }}
      />
      <Tabs.Screen name="cart" options={{ title: 'Корзина' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Избранное' }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль' }} />
    </Tabs>
  );
}
