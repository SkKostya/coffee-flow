// app/profile.tsx
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '../../src/shared/hooks/useColors';

const user = {
  name: 'Иван Петров',
  email: 'ivan.petrov@example.com',
  avatar: 'https://i.pravatar.cc/150?img=12',
};

export default function ProfileScreen({ navigation }: any) {
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.backgrounds.primary,
    },
    header: { alignItems: 'center', marginBottom: 30 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    name: { fontSize: 20, fontWeight: '700', color: colors.texts.primary },
    email: { fontSize: 14, color: colors.texts.secondary },
    menu: { marginTop: 20 },
    menuItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borders.subtle,
    },
    menuText: { fontSize: 16, color: colors.texts.primary },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.navigate('/orders')}
        >
          <Text style={styles.menuText}>Мои заказы</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.navigate('/favorites')}
        >
          <Text style={styles.menuText}>Избранное</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuText}>Настройки</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.navigate('/auth/login')}
        >
          <Text style={[styles.menuText, { color: colors.error.main }]}>
            Выйти
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
