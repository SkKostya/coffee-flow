import { Ionicons } from '@expo/vector-icons';
import { Overlay, Text } from '@rneui/themed';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useColors } from '../hooks/useColors';

interface CartSuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  onViewCart: () => void;
  itemsCount: number;
  totalItems: number;
  failedItems: number;
}

const CartSuccessModal: React.FC<CartSuccessModalProps> = ({
  isVisible,
  onClose,
  onViewCart,
  itemsCount,
  totalItems,
  failedItems,
}) => {
  const colors = useColors();

  const isPartialSuccess = failedItems > 0;
  const isFullSuccess = failedItems === 0;

  const styles = StyleSheet.create({
    modalOverlay: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: colors.backgrounds.neutral,
      borderRadius: 16,
      padding: 24,
      marginHorizontal: 20,
      maxWidth: 400,
      width: '90%',
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitleContainer: {
      alignItems: 'center',
      flex: 1,
    },
    closeButton: {
      padding: 4,
    },
    successIcon: {
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.texts.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 16,
      color: colors.texts.secondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    modalContent: {
      marginBottom: 24,
      maxHeight: 200,
    },
    successMessage: {
      fontSize: 16,
      color: colors.texts.primary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 12,
    },
    partialMessage: {
      fontSize: 14,
      color: colors.texts.secondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    continueButton: {
      flex: 1,
      backgroundColor: colors.backgrounds.elevated,
      borderWidth: 1,
      borderColor: colors.borders.primary,
      borderRadius: 8,
      paddingVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewCartButton: {
      flex: 1,
      backgroundColor: colors.primary.main,
      borderRadius: 8,
      paddingVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    continueButtonText: {
      color: colors.texts.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    viewCartButtonText: {
      color: colors.texts.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const getTitle = () => {
    if (isFullSuccess) {
      return 'Товары добавлены!';
    }
    return 'Частично добавлено';
  };

  const getMessage = () => {
    if (isFullSuccess) {
      return `Все ${itemsCount} товаров успешно добавлены в корзину`;
    }
    return `Добавлено ${itemsCount} из ${totalItems} товаров в корзину`;
  };

  const getSubMessage = () => {
    if (isPartialSuccess) {
      return `${failedItems} товаров не удалось добавить`;
    }
    return null;
  };

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onClose}
      overlayStyle={styles.modalOverlay}
      backdropStyle={styles.modalOverlay}
    >
      <View style={styles.modalContainer}>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <View style={styles.modalTitleContainer}>
            <Ionicons
              name={isFullSuccess ? 'checkmark-circle' : 'warning'}
              size={64}
              color={isFullSuccess ? colors.success.main : colors.warning.main}
              style={styles.successIcon}
            />
            <Text style={styles.modalTitle}>{getTitle()}</Text>
            <Text style={styles.modalSubtitle}>
              {isFullSuccess
                ? 'Можете перейти в корзину для оформления заказа'
                : 'Некоторые товары не удалось добавить'}
            </Text>
          </View>
          <Ionicons
            name="close"
            size={24}
            color={colors.texts.primary}
            style={styles.closeButton}
            onPress={onClose}
          />
        </View>

        {/* Modal Content */}
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.successMessage}>{getMessage()}</Text>
          {getSubMessage() && (
            <Text style={styles.partialMessage}>{getSubMessage()}</Text>
          )}
        </ScrollView>

        {/* Modal Buttons */}
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.continueButton} onPress={onClose}>
            <Text style={styles.continueButtonText}>Продолжить покупки</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewCartButton} onPress={onViewCart}>
            <Text style={styles.viewCartButtonText}>Перейти в корзину</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
};

export default CartSuccessModal;
