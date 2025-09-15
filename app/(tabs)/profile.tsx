import { TOKEN_KEY, USER_KEY } from '@/src/store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ListItem, Text } from '@rneui/themed';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useColors } from '../../src/shared/hooks/useColors';

const isAuthenticated = true;

export default function ProfileScreen() {
  const colors = useColors();

  const handleLogout = () => {
    AsyncStorage.removeItem(TOKEN_KEY);
    AsyncStorage.removeItem(USER_KEY);
    router.navigate('/auth/login');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
    },
    loginButton: {
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
    versionText: {
      textAlign: 'center',
      color: colors.texts.secondary,
      fontSize: 12,
      marginTop: 20,
      marginBottom: 30,
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
      id: 'notifications',
      title: 'Уведомления',
      icon: 'notifications-outline',
      onPress: () => {},
    },
    {
      id: 'faq',
      title: 'Часто задаваемые вопросы',
      icon: 'help-circle-outline',
      onPress: () => {},
    },
    {
      id: 'support',
      title: 'Служба поддержки',
      icon: 'headset-outline',
      onPress: () => {},
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
          {isAuthenticated ? (
            <>
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
            </>
          ) : (
            <>
              {menuItems
                .filter((item) =>
                  [
                    'cart',
                    'favorites',
                    'notifications',
                    'faq',
                    'support',
                  ].includes(item.id)
                )
                .map((item) => (
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
            </>
          )}
        </View>
      </View>

      <Text style={styles.versionText}>Версия 10.4.97</Text>
    </ScrollView>
  );
}
