import { formatPhoneNumber } from '@/src/shared/helpers/specific-tools';
import { Ionicons } from '@expo/vector-icons';
import { ListItem, Text } from '@rneui/themed';
import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { DeleteAccountModal } from '../src/profile';
import { useColors } from '../src/shared/hooks/useColors';
import { useProfile } from '../src/store';

export default function AccountScreen() {
  const colors = useColors();
  const { profile, isLoading, error, loadProfile: refetch } = useProfile();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
    },
    header: {
      paddingTop: 42,
      paddingBottom: 18,
      marginBottom: 16,
      backgroundColor: colors.backgrounds.neutral,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.texts.primary,
      marginLeft: 12,
    },
    editButton: {
      padding: 8,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.texts.primary,
      marginBottom: 12,
      paddingHorizontal: 20,
    },
    infoItem: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.borders.subtle,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    infoLabel: {
      fontSize: 16,
      color: colors.texts.primary,
    },
    infoValue: {
      fontSize: 16,
      color: colors.texts.primary,
      fontWeight: '500',
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
    deleteText: {
      fontSize: 16,
      color: colors.error.main,
      marginLeft: 12,
    },
    deleteIcon: {
      color: colors.error.main,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgrounds.primary,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgrounds.primary,
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: colors.error.main,
      textAlign: 'center',
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: colors.primary.main,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: {
      color: colors.texts.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const handleEdit = () => {
    router.navigate('/edit-account');
  };

  const handleChangePassword = () => {
    router.navigate('/change-password');
  };

  const handlePaymentMethods = () => {
    router.navigate('/payment-methods');
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  // Обновляем данные профиля при фокусе на экране
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Состояние загрузки
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={{ marginTop: 16, color: colors.texts.secondary }}>
            Загрузка данных...
          </Text>
        </View>
      </View>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ошибка загрузки данных: {error}</Text>
          <View style={styles.retryButton}>
            <Text style={styles.retryButtonText} onPress={refetch}>
              Повторить
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.texts.primary}
            onPress={() => router.back()}
          />
          <Text style={styles.title}>Учетная запись</Text>
        </View>
        <Ionicons
          name="pencil"
          size={20}
          color={colors.texts.primary}
          style={styles.editButton}
          onPress={handleEdit}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* User Information Section */}
        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Имя</Text>
            <Text style={styles.infoValue}>
              {profile
                ? `${profile.firstName} ${profile.lastName}`
                : 'Не указано'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Номер телефона</Text>
            <Text style={styles.infoValue}>
              {profile?.phoneNumber
                ? formatPhoneNumber(profile.phoneNumber)
                : 'Не указано'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>
              {profile?.email || 'Не указано'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Статус</Text>
            <Text style={styles.infoValue}>
              {profile?.isActive ? 'Активен' : 'Неактивен'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Телефон подтвержден</Text>
            <Text style={styles.infoValue}>
              {profile?.isPhoneVerified ? 'Да' : 'Нет'}
            </Text>
          </View>
        </View>

        {/* Account Actions Section */}
        <View style={styles.section}>
          <ListItem
            containerStyle={styles.menuItem}
            onPress={handleChangePassword}
          >
            <ListItem.Content style={styles.menuItemContent}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color={colors.texts.primary}
                />
                <Text style={styles.menuItemText}>Изменить пароль</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.texts.secondary}
              />
            </ListItem.Content>
          </ListItem>

          <ListItem
            containerStyle={styles.menuItem}
            onPress={handlePaymentMethods}
          >
            <ListItem.Content style={styles.menuItemContent}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="card-outline"
                  size={24}
                  color={colors.texts.primary}
                />
                <Text style={styles.menuItemText}>Способы оплаты</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.texts.secondary}
              />
            </ListItem.Content>
          </ListItem>
        </View>

        {/* Delete Account Section */}
        <View style={styles.section}>
          <ListItem
            containerStyle={styles.menuItem}
            onPress={handleDeleteAccount}
          >
            <ListItem.Content style={styles.menuItemContent}>
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={colors.error.main}
                />
                <Text style={styles.deleteText}>Удалить учетную запись</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.texts.secondary}
              />
            </ListItem.Content>
          </ListItem>
        </View>
      </ScrollView>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isVisible={isDeleteModalVisible}
        onClose={handleCancelDelete}
      />
    </View>
  );
}
