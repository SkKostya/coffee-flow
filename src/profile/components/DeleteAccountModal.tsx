import { Ionicons } from '@expo/vector-icons';
import { Overlay, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useColors } from '../../shared/hooks/useColors';

interface DeleteAccountModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isVisible,
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
      maxWidth: 420,
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
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    warningIcon: {
      marginRight: 16,
      marginTop: 2,
    },
    modalTextContainer: {
      flex: 1,
    },
    modalMainText: {
      fontSize: 16,
      color: colors.texts.primary,
      marginBottom: 8,
      lineHeight: 22,
    },
    modalWarningText: {
      fontSize: 14,
      color: colors.error.main,
      lineHeight: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      height: 42,
      paddingInline: 12,
      backgroundColor: colors.success.main,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButton: {
      flex: 1,
      height: 42,
      paddingInline: 12,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.error.main,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelButtonText: {
      color: colors.texts.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
    deleteButtonText: {
      color: colors.error.main,
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
          <Text style={styles.modalTitle}>Удаление учетной записи</Text>
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
          <Ionicons
            name="warning"
            size={48}
            color={colors.error.main}
            style={styles.warningIcon}
          />
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalMainText}>
              Вы уверены, что хотите удалить учетную запись?
            </Text>
            <Text style={styles.modalWarningText}>
              Это действие необратимо, все данные будут безвозвратно удалены.
            </Text>
          </View>
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

export default DeleteAccountModal;
