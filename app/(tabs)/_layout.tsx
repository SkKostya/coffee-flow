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
          paddingBottom: 15,
          paddingTop: 5,
        },
        tabBarActiveTintColor: colors.primary.main,
        headerStyle: {
          backgroundColor: colors.backgrounds.primary,
        },
        headerTintColor: colors.texts.primary,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';

          if (route.name === 'coffee-shops') iconName = 'cafe-outline';
          if (route.name === 'favorites') iconName = 'heart-outline';
          if (route.name === 'profile') iconName = 'person-outline';
          if (route.name === 'orders') iconName = 'list-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="coffee-shops" options={{ title: 'Кофейни' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Избранное' }} />
      <Tabs.Screen name="orders" options={{ title: 'Заказы' }} />
      <Tabs.Screen name="profile" options={{ title: 'Профиль' }} />
    </Tabs>
  );
}
