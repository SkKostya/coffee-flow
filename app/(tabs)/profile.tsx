import { Ionicons } from '@expo/vector-icons';
import { Button, ListItem, Text } from '@rneui/themed';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useColors } from '../../src/shared/hooks/useColors';
import { useAuth } from '../../src/store/hooks/useAuth';
import { useTheme } from '../../src/store/hooks/useTheme';

export default function ProfileScreen() {
  const colors = useColors();
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      // AsyncStorage.removeItem(TOKEN_KEY);
      // AsyncStorage.removeItem(USER_KEY);
      router.navigate('/auth/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return 'sunny-outline';
      case 'dark':
        return 'moon-outline';
      case 'system':
        return 'phone-portrait-outline';
      default:
        return 'phone-portrait-outline';
    }
  };

  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return 'Светлая тема';
      case 'dark':
        return 'Темная тема';
      case 'system':
        return 'Системная тема';
      default:
        return 'Системная тема';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
    },
    loginButton: {
      marginTop: 32,
      marginHorizontal: 20,
      marginBottom: 16,
      borderRadius: 12,
    },
    menuItem: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.borders.subtle,
    },
    menuItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuItemText: {
      fontSize: 16,
      color: colors.texts.primary,
      marginLeft: 12,
    },
    logoutText: {
      fontSize: 16,
      color: colors.error.main,
      marginLeft: 12,
    },
  });

  const menuItems = [
    {
      id: 'account',
      title: 'Учетная запись',
      icon: 'person-outline',
      onPress: () => router.navigate('/account'),
    },
    {
      id: 'cart',
      title: 'Корзина',
      icon: 'cart-outline',
      onPress: () => router.navigate('/cart'),
    },
    {
      id: 'favorites',
      title: 'Избранные',
      icon: 'heart-outline',
      onPress: () => router.navigate('/favorites'),
    },
    {
      id: 'orders',
      title: 'История заказов',
      icon: 'time-outline',
      onPress: () => router.navigate('/orders'),
    },
    {
      id: 'theme',
      title: getThemeText(),
      icon: getThemeIcon(),
      onPress: toggleTheme,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
    >
      <View>
        {!isAuthenticated && (
          <View style={styles.loginButton}>
            <Button
              title="Авторизоваться"
              icon={<Ionicons name="person-outline" size={20} color="white" />}
              iconPosition="left"
              onPress={() => router.navigate('/auth/login')}
            />
          </View>
        )}

        <View>
          {menuItems.map((item) => (
            <ListItem
              key={item.id}
              containerStyle={styles.menuItem}
              onPress={item.onPress}
            >
              <ListItem.Content style={styles.menuItemContent}>
                <View style={styles.menuItemLeft}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={colors.texts.primary}
                  />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.texts.secondary}
                />
              </ListItem.Content>
            </ListItem>
          ))}

          {isAuthenticated && (
            <ListItem containerStyle={styles.menuItem} onPress={handleLogout}>
              <ListItem.Content style={styles.menuItemContent}>
                <View style={styles.menuItemLeft}>
                  <Ionicons
                    name="exit-outline"
                    size={24}
                    color={colors.error.main}
                  />
                  <Text style={styles.logoutText}>Выйти</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.texts.secondary}
                />
              </ListItem.Content>
            </ListItem>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
