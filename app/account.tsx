import { Ionicons } from '@expo/vector-icons';
import { ListItem, Text } from '@rneui/themed';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DeleteAccountModal } from '../src/profile';
import { useColors } from '../src/shared/hooks/useColors';

export default function AccountScreen() {
  const colors = useColors();
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

  const handleConfirmDelete = () => {
    // TODO: Реализовать удаление аккаунта
    console.log('Confirm delete account');
    setIsDeleteModalVisible(false);
    // Здесь будет логика удаления аккаунта
  };

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
            <Text style={styles.infoValue}>Аружан</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Номер телефона</Text>
            <Text style={styles.infoValue}>+7 (777) 777 77-77</Text>
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
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}
