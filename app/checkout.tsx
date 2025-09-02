// app/checkout.tsx
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useColors } from '../src/shared/hooks/useColors';

const paymentMethods = ['Карта', 'Kaspi QR', 'Наличные'];

export default function CheckoutScreen({ navigation }: any) {
  const colors = useColors();
  const [selected, setSelected] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.backgrounds.primary,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 12,
      textAlign: 'center',
      color: colors.texts.secondary,
    },
    method: {
      padding: 16,
      borderWidth: 1,
      borderColor: colors.borders.subtle,
      borderRadius: 8,
      marginBottom: 12,
      backgroundColor: colors.backgrounds.input,
    },
    selected: {
      borderColor: colors.primary.main,
      backgroundColor: colors.colors.primary[100],
    },
    methodText: { fontSize: 16, textAlign: 'center' },
    button: {
      backgroundColor: colors.primary.main,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: { color: colors.colors.white, fontSize: 16, fontWeight: '600' },
  });

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Оплата' }} />

      <Text style={styles.subtitle}>Выберите способ оплаты</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method}
          style={[styles.method, selected === method && styles.selected]}
          onPress={() => setSelected(method)}
        >
          <Text
            style={[
              styles.methodText,
              {
                color:
                  selected === method
                    ? colors.colors.black
                    : colors.texts.primary,
              },
            ]}
          >
            {method}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.button,
          !selected && { backgroundColor: colors.colors.neutral[300] },
        ]}
        disabled={!selected}
        onPress={() => navigation.navigate('Orders')}
      >
        <Text style={styles.buttonText}>Подтвердить заказ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
