import { Button, Card, Text } from '@rneui/themed';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useColors } from '../../shared/hooks/useColors';
import { useProfile } from '../hooks/useProfile';
import { AddCardModal } from './AddCardModal';
import { DeleteAccountModal } from './DeleteAccountModal';
import { DeleteCardModal } from './DeleteCardModal';
import { PaymentMethodCard } from './PaymentMethodCard';

const ProfileScreen: React.FC = () => {
  const colors = useColors();
  const { profile, isLoading, error, refetch, updateProfile, deleteAccount } =
    useProfile();
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
  const [selectedCardNumber, setSelectedCardNumber] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
    },
    scrollView: {
      flex: 1,
      padding: 16,
    },
    profileCard: {
      backgroundColor: colors.backgrounds.neutral,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    },
    profileTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.texts.primary,
      marginBottom: 16,
    },
    profileInfo: {
      marginBottom: 12,
    },
    profileLabel: {
      fontSize: 14,
      color: colors.texts.secondary,
      marginBottom: 4,
    },
    profileValue: {
      fontSize: 16,
      color: colors.texts.primary,
      fontWeight: '500',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.texts.primary,
      marginBottom: 12,
      marginTop: 8,
    },
    paymentMethodsCard: {
      backgroundColor: colors.backgrounds.neutral,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    },
    dangerSection: {
      backgroundColor: colors.backgrounds.neutral,
      borderRadius: 12,
      padding: 20,
    },
    dangerButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.error.main,
      borderRadius: 8,
      paddingVertical: 12,
    },
    dangerButtonText: {
      color: colors.error.main,
      fontSize: 16,
      fontWeight: '600',
    },
    loadingText: {
      textAlign: 'center',
      color: colors.texts.secondary,
      fontSize: 16,
      marginTop: 20,
    },
    errorText: {
      textAlign: 'center',
      color: colors.error.main,
      fontSize: 16,
      marginTop: 20,
    },
  });

  const handleAddCard = () => {
    setShowAddCardModal(true);
  };

  const handleDeleteCard = (cardNumber: string) => {
    setSelectedCardNumber(cardNumber);
    setShowDeleteCardModal(true);
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(true);
  };

  const handleUpdateProfile = async () => {
    // Пример обновления профиля
    const result = await updateProfile({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    });

    if (result.success) {
      console.log('Профиль обновлен');
    } else {
      console.error('Ошибка обновления профиля:', result.error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Загрузка профиля...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Ошибка: {error}</Text>
        <Button
          title="Повторить"
          onPress={refetch}
          color="primary"
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Профиль пользователя */}
        <Card containerStyle={styles.profileCard}>
          <Text style={styles.profileTitle}>Профиль</Text>

          {profile && (
            <>
              <View style={styles.profileInfo}>
                <Text style={styles.profileLabel}>Имя</Text>
                <Text style={styles.profileValue}>
                  {profile.firstName} {profile.lastName}
                </Text>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileLabel}>Телефон</Text>
                <Text style={styles.profileValue}>{profile.phoneNumber}</Text>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileLabel}>Email</Text>
                <Text style={styles.profileValue}>{profile.email}</Text>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileLabel}>Статус</Text>
                <Text style={styles.profileValue}>
                  {profile.isActive ? 'Активен' : 'Неактивен'}
                </Text>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.profileLabel}>Телефон подтвержден</Text>
                <Text style={styles.profileValue}>
                  {profile.isPhoneVerified ? 'Да' : 'Нет'}
                </Text>
              </View>
            </>
          )}

          <Button
            title="Обновить профиль"
            onPress={handleUpdateProfile}
            color="primary"
            style={{ marginTop: 16 }}
          />
        </Card>

        {/* Способы оплаты */}
        <Card containerStyle={styles.paymentMethodsCard}>
          <Text style={styles.sectionTitle}>Способы оплаты</Text>

          {/* Существующие карты */}
          <PaymentMethodCard
            cardNumber="1234"
            onDelete={() => handleDeleteCard('1234')}
          />
          <PaymentMethodCard
            cardNumber="5678"
            onDelete={() => handleDeleteCard('5678')}
          />

          {/* Кнопка добавления новой карты */}
          <PaymentMethodCard isAddNew onPress={handleAddCard} />
        </Card>

        {/* Опасная зона */}
        <Card containerStyle={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Опасная зона</Text>
          <Button
            title="Удалить аккаунт"
            onPress={handleDeleteAccount}
            buttonStyle={styles.dangerButton}
            titleStyle={styles.dangerButtonText}
          />
        </Card>
      </ScrollView>

      {/* Модальные окна */}
      <AddCardModal
        isVisible={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onSubmit={(data) => {
          console.log('Добавление карты:', data);
          setShowAddCardModal(false);
        }}
      />

      <DeleteAccountModal
        isVisible={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        onConfirm={() => {
          console.log('Аккаунт удален');
          setShowDeleteAccountModal(false);
        }}
      />

      <DeleteCardModal
        isVisible={showDeleteCardModal}
        cardNumber={selectedCardNumber}
        onClose={() => setShowDeleteCardModal(false)}
        onConfirm={() => {
          console.log('Карта удалена:', selectedCardNumber);
          setShowDeleteCardModal(false);
        }}
      />
    </View>
  );
};

export default ProfileScreen;
