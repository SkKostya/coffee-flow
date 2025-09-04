import { Ionicons } from '@expo/vector-icons';
import { Overlay, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useColors } from '../../shared';

interface DeleteOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const colors = useColors();

  return (
    <Overlay
      fullScreen
      isVisible={visible}
      onBackdropPress={onClose}
      overlayStyle={styles.overlay}
    >
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: colors.backgrounds.card },
        ]}
      >
        {/* Заголовок с кнопкой закрытия */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.texts.primary }]}>
            Внимание
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.texts.primary} />
          </TouchableOpacity>
        </View>

        {/* Текст вопроса */}
        <Text style={[styles.question, { color: colors.texts.primary }]}>
          Удалить заказ из избранного?
        </Text>

        {/* Кнопки действий */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.cancelButton,
              {
                borderColor: colors.primary.main,
                backgroundColor: colors.backgrounds.card,
              },
            ]}
            onPress={onClose}
          >
            <Text
              style={[styles.cancelButtonText, { color: colors.primary.main }]}
            >
              Отменить
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deleteButton,
              { backgroundColor: colors.primary.main },
            ]}
            onPress={onConfirm}
          >
            <Text
              style={[styles.deleteButtonText, { color: colors.texts.inverse }]}
            >
              Да, удалить
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    borderRadius: 16,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  question: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 24,
    textAlign: 'left',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DeleteOrderModal;
