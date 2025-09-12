import { Ionicons } from '@expo/vector-icons';
import { Text } from '@rneui/themed';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  AddCardModal,
  DeleteCardModal,
  PaymentMethodCard,
} from '../src/profile';
import type { AddCardFormData } from '../src/profile/validation/addCardSchema';
import { useColors } from '../src/shared/hooks/useColors';
import { usePaymentMethods } from '../src/store';
import type { CreatePaymentMethodRequest } from '../src/types';

export default function PaymentMethodsScreen() {
  const colors = useColors();

  // Redux hooks
  const {
    methods: paymentMethods,
    defaultMethod,
    info,
    loadingStates,
    loadPaymentMethods,
    createPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    clearError,
  } = usePaymentMethods();

  // Modal states
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string>('');

  // Загружаем методы оплаты при монтировании компонента
  useEffect(() => {
    loadPaymentMethods();
  }, [loadPaymentMethods]);

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
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
  });

  const handleDeleteCard = (cardId: string) => {
    setCardToDelete(cardId);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePaymentMethod(cardToDelete);
      setIsDeleteModalVisible(false);
      setCardToDelete('');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить метод оплаты');
    }
  };

  const handleAddNewCard = () => {
    setIsAddModalVisible(true);
  };

  const handleAddCardSubmit = async (data: AddCardFormData) => {
    try {
      // Парсим дату истечения из формата MM/YY
      const [expiryMonth, expiryYear] = data.expiryDate.split('/');

      const createData: CreatePaymentMethodRequest = {
        type: 'card',
        cardNumber: data.cardNumber,
        cardHolderName: 'Card Holder', // Пока заглушка, можно добавить поле в форму
        expiryMonth: expiryMonth || '12',
        expiryYear: `20${expiryYear}` || '2028',
        cardBrand: 'visa', // Пока заглушка, можно определить по номеру карты
        isDefault: paymentMethods.length === 0, // Первая карта по умолчанию
      };

      await createPaymentMethod(createData);
      setIsAddModalVisible(false);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить метод оплаты');
    }
  };

  const handleCardPress = (cardId: string) => {
    // TODO: Реализовать редактирование карты
    console.log('Edit card:', cardId);
  };

  const handleSetDefault = async (cardId: string) => {
    try {
      await setDefaultPaymentMethod(cardId);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось установить метод оплаты по умолчанию');
    }
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
          <Text style={styles.title}>Способы оплаты</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Loading State */}
        {loadingStates.isLoading && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>Загрузка методов оплаты...</Text>
          </View>
        )}

        {/* Error State */}
        {info.error && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: colors.error.main, textAlign: 'center' }}>
              {info.error}
            </Text>
          </View>
        )}

        {/* Empty State */}
        {!loadingStates.isLoading && !info.error && info.isEmpty && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text
              style={{ color: colors.texts.secondary, textAlign: 'center' }}
            >
              У вас пока нет сохраненных методов оплаты
            </Text>
          </View>
        )}

        {/* Saved Payment Methods */}
        {!loadingStates.isLoading &&
          !info.error &&
          paymentMethods.map((card) => (
            <PaymentMethodCard
              key={card.id}
              cardNumber={card.cardNumber.replace('**** ', '')} // Извлекаем последние 4 цифры
              onDelete={() => handleDeleteCard(card.id)}
              onPress={() => handleCardPress(card.id)}
            />
          ))}

        {/* Add New Card */}
        <PaymentMethodCard isAddNew cardNumber="" onPress={handleAddNewCard} />
      </ScrollView>

      {/* Delete Card Modal */}
      <DeleteCardModal
        isVisible={isDeleteModalVisible}
        cardNumber={
          paymentMethods.find((card) => card.id === cardToDelete)?.cardNumber ||
          ''
        }
        onClose={() => {
          setIsDeleteModalVisible(false);
          setCardToDelete('');
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Add Card Modal */}
      <AddCardModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSubmit={handleAddCardSubmit}
      />
    </View>
  );
}
