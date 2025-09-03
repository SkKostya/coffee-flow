import { Ionicons } from '@expo/vector-icons';
import { Text } from '@rneui/themed';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  AddCardModal,
  DeleteCardModal,
  PaymentMethodCard,
} from '../src/profile';
import type { AddCardFormData } from '../src/profile/validation/addCardSchema';
import { useColors } from '../src/shared/hooks/useColors';

interface PaymentMethod {
  id: string;
  cardNumber: string;
  lastFourDigits: string;
}

export default function PaymentMethodsScreen() {
  const colors = useColors();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      cardNumber: '8668',
      lastFourDigits: '8668',
    },
  ]);

  // Modal states
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string>('');

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

  const handleConfirmDelete = () => {
    setPaymentMethods((prev) =>
      prev.filter((card) => card.id !== cardToDelete)
    );
    setIsDeleteModalVisible(false);
    setCardToDelete('');
  };

  const handleAddNewCard = () => {
    setIsAddModalVisible(true);
  };

  const handleAddCardSubmit = (data: AddCardFormData) => {
    // Данные уже валидированы в модалке
    const lastFourDigits = data.cardNumber.slice(-4);
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      cardNumber: data.cardNumber,
      lastFourDigits,
    };

    setPaymentMethods((prev) => [...prev, newCard]);
    setIsAddModalVisible(false);
  };

  const handleCardPress = (cardId: string) => {
    // TODO: Реализовать редактирование карты
    console.log('Edit card:', cardId);
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
        {/* Saved Payment Methods */}
        {paymentMethods.map((card) => (
          <PaymentMethodCard
            key={card.id}
            cardNumber={card.lastFourDigits}
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
        cardNumber={cardToDelete}
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
