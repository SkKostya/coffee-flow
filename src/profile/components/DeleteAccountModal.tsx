import { Ionicons } from '@expo/vector-icons';
import { Overlay, Text } from '@rneui/themed';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useProfileContext } from '../../shared/contexts/ProfileContext';
import { useColors } from '../../shared/hooks/useColors';

interface DeleteAccountModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  const colors = useColors();
  const { deleteAccount } = useProfileContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      // Для удаления аккаунта нужен пароль, но в текущей форме его нет
      // Пока используем пустую строку, в реальном приложении нужно запросить пароль
      const result = await deleteAccount('');

      if (result.success) {
        onConfirm?.();
        onClose();
      } else {
        setError(result.error || 'Ошибка удаления аккаунта');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка удаления аккаунта';
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
      opacity: isDeleting ? 0.5 : 1,
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

export default DeleteAccountModal;
