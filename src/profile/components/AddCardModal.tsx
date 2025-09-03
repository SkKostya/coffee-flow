import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Overlay, Text } from '@rneui/themed';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useMaskedInputProps } from 'react-native-mask-input';
import FormField from '../../shared/components/FormField';
import { useColors } from '../../shared/hooks/useColors';
import {
  addCardSchema,
  type AddCardFormData,
} from '../validation/addCardSchema';

interface AddCardModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: AddCardFormData) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
}) => {
  const colors = useColors();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AddCardFormData>({
    resolver: zodResolver(addCardSchema),
    mode: 'onChange',
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
    },
  });

  const cardNumberMaskedProps = useMaskedInputProps({
    mask: [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  });

  const expiryDateMaskedProps = useMaskedInputProps({
    mask: [/\d/, /\d/, '/', /\d/, /\d/],
  });

  const cvcMaskedProps = useMaskedInputProps({
    mask: [/\d/, /\d/, /\d/, /\d/],
  });

  const styles = StyleSheet.create({
    modalOverlay: {
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: colors.backgrounds.neutral,
      borderRadius: 16,
      padding: 24,
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
    addButton: {
      backgroundColor: colors.primary.main,
      borderRadius: 8,
      paddingVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonText: {
      color: colors.texts.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const handleFormSubmit = (data: AddCardFormData) => {
    onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Overlay
      fullScreen
      isVisible={isVisible}
      onBackdropPress={handleClose}
      overlayStyle={styles.modalOverlay}
      backdropStyle={styles.modalOverlay}
    >
      <View style={styles.modalContainer}>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Добавление новой карты</Text>
          <Ionicons
            name="close"
            size={24}
            color={colors.texts.primary}
            style={styles.closeButton}
            onPress={handleClose}
          />
        </View>

        {/* Modal Content */}
        <View style={styles.modalContent}>
          <View style={{ position: 'relative' }}>
            <Controller
              control={control}
              name="cardNumber"
              render={({ field: { onChange, value } }) => (
                <FormField
                  label="Номер карты"
                  value={value}
                  onChangeText={onChange}
                  placeholder="1234 5678 9012 3456"
                  error={errors.cardNumber?.message}
                  keyboardType="numeric"
                  maskedInputProps={{
                    ...cardNumberMaskedProps,
                    value,
                    onChangeText: onChange,
                  }}
                />
              )}
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="expiryDate"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    label="MM/YY"
                    value={value}
                    onChangeText={onChange}
                    placeholder="12/25"
                    error={errors.expiryDate?.message}
                    keyboardType="numeric"
                    maskedInputProps={{
                      ...expiryDateMaskedProps,
                      value,
                      onChangeText: onChange,
                    }}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="cvc"
                render={({ field: { onChange, value } }) => (
                  <FormField
                    label="CVC/CVV"
                    value={value}
                    onChangeText={onChange}
                    placeholder="123"
                    error={errors.cvc?.message}
                    keyboardType="numeric"
                    maskedInputProps={{
                      ...cvcMaskedProps,
                      value,
                      onChangeText: onChange,
                    }}
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={[styles.addButton, !isValid && { opacity: 0.5 }]}
          onPress={handleSubmit(handleFormSubmit)}
          disabled={!isValid}
        >
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>
      </View>
    </Overlay>
  );
};

export default AddCardModal;
