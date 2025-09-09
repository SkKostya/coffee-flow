import { Ionicons } from '@expo/vector-icons';
import { Overlay, Text } from '@rneui/themed';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useColors } from '../../shared/hooks/useColors';

interface DeleteCardModalProps {
  isVisible: boolean;
  cardNumber: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const DeleteCardModal: React.FC<DeleteCardModalProps> = ({
  isVisible,
  cardNumber,
  onClose,
  onConfirm,
}) => {
  const colors = useColors();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      // Здесь можно добавить API вызов для удаления карты
      // Пока просто имитируем успешное удаление
      console.log('Deleting card:', cardNumber);

      // Имитация задержки API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onConfirm?.();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка удаления карты';
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: colors.backgrounds.neutral,
      borderRadius: 16,
      padding: 24,
      maxWidth: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.texts.primary,
    },
    closeButton: {
      padding: 4,
    },
    modalContent: {
      marginBottom: 24,
    },
    modalText: {
      fontSize: 16,
      color: colors.texts.primary,
      lineHeight: 22,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: colors.primary.main,
      borderRadius: 8,
      paddingVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButton: {
      flex: 1,
      backgroundColor: colors.error.main,
      borderRadius: 8,
      paddingVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: isDeleting ? 0.5 : 1,
    },
    cancelButtonText: {
      color: colors.texts.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
    deleteButtonText: {
      color: colors.texts.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
    errorText: {
      color: colors.error.main,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 16,
    },
  });

  return (
    <Overlay
      fullScreen
      isVisible={isVisible}
      onBackdropPress={onClose}
      overlayStyle={styles.modalOverlay}
      backdropStyle={styles.modalOverlay}
    >
      <View style={styles.modalContainer}>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Удаление банковской карты</Text>
          <Ionicons
            name="close"
            size={24}
            color={colors.texts.primary}
            style={styles.closeButton}
            onPress={onClose}
          />
        </View>

        {/* Modal Content */}
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Вы уверены, что хотите удалить банковскую карту **** {cardNumber}?
          </Text>
        </View>

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Modal Buttons */}
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isDeleting}
          >
            <Text style={styles.cancelButtonText}>Отменить</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleConfirm}
            disabled={isDeleting}
          >
            <Text style={styles.deleteButtonText}>
              {isDeleting ? 'Удаление...' : 'Да, удалить'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
};

export default DeleteCardModal;
