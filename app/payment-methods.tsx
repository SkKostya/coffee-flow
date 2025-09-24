import { Ionicons } from '@expo/vector-icons';
import { Text } from '@rneui/themed';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { paymentMethodsApi } from '../src/payment-methods/api/paymentMethodsApi';
import {
  AddCardModal,
  DeleteCardModal,
  PaymentMethodCard,
} from '../src/profile';
import type { AddCardFormData } from '../src/profile/validation/addCardSchema';
import { useColors, useToast } from '../src/shared';
import { usePaymentMethods } from '../src/store';
import type {
  CreatePaymentMethodRequest,
  PaymentMethod,
  UpdatePaymentMethodRequest,
} from '../src/types';

export default function PaymentMethodsScreen() {
  const colors = useColors();
  const { showSuccess, showError } = useToast();

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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string>('');
  const [cardToEdit, setCardToEdit] = useState<PaymentMethod | null>(null);

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
      // Используем реальный API для удаления карты
      await paymentMethodsApi.deletePaymentMethod(cardToDelete);

      // Перезагружаем список методов оплаты
      await loadPaymentMethods();

      setIsDeleteModalVisible(false);
      setCardToDelete('');
      showSuccess('Метод оплаты удален', 'Способы оплаты', 3000);
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      showError('Не удалось удалить метод оплаты');
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
        name: 'Банковская карта',
        cardNumber: data.cardNumber,
        cardHolderName: 'Card Holder', // Пока заглушка, можно добавить поле в форму
        expiryMonth: expiryMonth || '12',
        expiryYear: `20${expiryYear}` || '2028',
        cardBrand: 'visa', // Пока заглушка, можно определить по номеру карты
        isDefault: paymentMethods.length === 0, // Первая карта по умолчанию
      };

      // Используем реальный API для создания карты
      await paymentMethodsApi.createPaymentMethod(createData);

      // Перезагружаем список методов оплаты
      await loadPaymentMethods();

      setIsAddModalVisible(false);
      showSuccess('Метод оплаты добавлен', 'Способы оплаты', 3000);
    } catch (error) {
      console.error('Failed to add payment method:', error);
      showError('Не удалось добавить метод оплаты');
    }
  };

  const handleCardPress = (cardId: string) => {
    const card = paymentMethods.find((card) => card.id === cardId);
    if (card) {
      setCardToEdit(card);
      setIsEditModalVisible(true);
    }
  };

  const handleEditCardSubmit = async (data: AddCardFormData) => {
    try {
      if (!cardToEdit) return;

      // Парсим дату истечения из формата MM/YY
      const [expiryMonth, expiryYear] = data.expiryDate.split('/');

      const updateData: UpdatePaymentMethodRequest = {
        type: 'card',
        name: 'Банковская карта',
        cardNumber: data.cardNumber,
        cardHolderName: 'Card Holder', // Пока заглушка, можно добавить поле в форму
        expiryMonth: expiryMonth || '12',
        expiryYear: `20${expiryYear}` || '2028',
        cardBrand: 'visa', // Пока заглушка, можно определить по номеру карты
        isDefault: cardToEdit.isDefault,
      };

      // Используем реальный API для обновления карты
      await paymentMethodsApi.updatePaymentMethod(cardToEdit.id, updateData);

      // Перезагружаем список методов оплаты
      await loadPaymentMethods();

      setIsEditModalVisible(false);
      setCardToEdit(null);
      showSuccess('Метод оплаты обновлен', 'Способы оплаты', 3000);
    } catch (error) {
      console.error('Failed to update payment method:', error);
      showError('Не удалось обновить метод оплаты');
    }
  };

  const handleSetDefault = async (cardId: string) => {
    try {
      // Используем реальный API для установки по умолчанию
      await paymentMethodsApi.setDefaultPaymentMethod(cardId);

      // Перезагружаем список методов оплаты
      await loadPaymentMethods();

      showSuccess(
        'Метод оплаты установлен по умолчанию',
        'Способы оплаты',
        3000
      );
    } catch (error) {
      console.error('Failed to set default payment method:', error);
      showError('Не удалось установить метод оплаты по умолчанию');
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
              cardNumber={card.cardNumber?.replace('**** ', '') || ''} // Извлекаем последние 4 цифры
              onDelete={() => handleDeleteCard(card.id)}
              onPress={() => handleCardPress(card.id)}
              onSetDefault={() => handleSetDefault(card.id)}
              isDefault={card.isDefault}
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

      {/* Edit Card Modal */}
      <AddCardModal
        isVisible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setCardToEdit(null);
        }}
        onSubmit={handleEditCardSubmit}
        isEditMode={true}
        initialData={
          cardToEdit
            ? {
                cardNumber: cardToEdit.cardNumber || '',
                expiryDate:
                  cardToEdit.expiryMonth && cardToEdit.expiryYear
                    ? `${cardToEdit.expiryMonth}/${cardToEdit.expiryYear.slice(
                        -2
                      )}`
                    : '',
                cvc: '', // CVC не сохраняется на сервере для безопасности
              }
            : undefined
        }
      />
    </View>
  );
}
