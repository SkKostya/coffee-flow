import { Ionicons } from '@expo/vector-icons';
import { Button, Text } from '@rneui/themed';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { PaymentMethod } from '../../types/payment-methods';
import { useColors } from '../hooks/useColors';

interface PaymentMethodModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (method: PaymentMethod) => void;
  paymentMethods: PaymentMethod[];
  selectedMethod?: PaymentMethod | null;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isVisible,
  onClose,
  onSelect,
  paymentMethods,
  selectedMethod,
}) => {
  const colors = useColors();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.backgrounds.primary,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 40,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.texts.primary,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.backgrounds.neutral,
      justifyContent: 'center',
      alignItems: 'center',
    },
    methodList: {
      marginBottom: 20,
    },
    methodItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: colors.backgrounds.neutral,
      borderRadius: 12,
      marginBottom: 12,
    },
    selectedMethod: {
      backgroundColor: colors.colors.primary[100],
      borderWidth: 1,
      borderColor: colors.primary.main,
    },
    methodIcon: {
      marginRight: 12,
    },
    methodInfo: {
      flex: 1,
    },
    methodName: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.texts.primary,
      marginBottom: 2,
    },
    methodDetails: {
      fontSize: 14,
      color: colors.texts.secondary,
    },
    checkIcon: {
      marginLeft: 12,
    },
    confirmButton: {
      backgroundColor: colors.primary.main,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: colors.texts.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    confirmButtonDisabled: {
      backgroundColor: colors.texts.disabled,
      opacity: 0.6,
    },
  });

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case 'kaspi':
        return 'card';
      case 'card':
        return 'card-outline';
      case 'cash':
        return 'cash-outline';
      default:
        return 'card-outline';
    }
  };

  const getMethodDisplayName = (method: PaymentMethod) => {
    switch (method.type) {
      case 'kaspi':
        return 'Kaspi';
      case 'card':
        return `Карта **** ${method.cardNumber?.slice(-4) || ''}`;
      case 'cash':
        return 'Наличные';
      default:
        return method.name || 'Неизвестный способ';
    }
  };

  const getMethodDetails = (method: PaymentMethod) => {
    switch (method.type) {
      case 'kaspi':
        return 'QR-код оплата';
      case 'card':
        return method.cardHolderName || 'Банковская карта';
      case 'cash':
        return 'Оплата при получении';
      default:
        return '';
    }
  };

  const handleConfirm = () => {
    if (selectedMethod) {
      onSelect(selectedMethod);
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Способ оплаты</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={colors.texts.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.methodList}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodItem,
                  selectedMethod?.id === method.id && styles.selectedMethod,
                ]}
                onPress={() => onSelect(method)}
              >
                <Ionicons
                  name={getMethodIcon(method)}
                  size={24}
                  color={colors.texts.primary}
                  style={styles.methodIcon}
                />
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>
                    {getMethodDisplayName(method)}
                  </Text>
                  <Text style={styles.methodDetails}>
                    {getMethodDetails(method)}
                  </Text>
                </View>
                {selectedMethod?.id === method.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.primary.main}
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Подтвердить"
            onPress={handleConfirm}
            disabled={!selectedMethod}
            buttonStyle={[
              styles.confirmButton,
              !selectedMethod && styles.confirmButtonDisabled,
            ]}
            titleStyle={styles.confirmButtonText}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default PaymentMethodModal;
