import { Ionicons } from '@expo/vector-icons';
import { Overlay, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useColors } from '../../shared/hooks/useColors';

interface DeleteCardModalProps {
  isVisible: boolean;
  cardNumber: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteCardModal: React.FC<DeleteCardModalProps> = ({
  isVisible,
  cardNumber,
  onClose,
  onConfirm,
}) => {
  const colors = useColors();

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

        {/* Modal Buttons */}
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Отменить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
            <Text style={styles.deleteButtonText}>Да, удалить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
};

export default DeleteCardModal;
