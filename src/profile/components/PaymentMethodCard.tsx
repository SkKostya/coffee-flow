import { Ionicons } from '@expo/vector-icons';
import { Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useColors } from '../../shared/hooks/useColors';

interface PaymentMethodCardProps {
  cardNumber: string;
  onDelete?: () => void;
  onPress?: () => void;
  isAddNew?: boolean;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  cardNumber,
  onDelete,
  onPress,
  isAddNew = false,
}) => {
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgrounds.neutral,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    icon: {
      marginRight: 12,
    },
    cardInfo: {
      flex: 1,
    },
    cardText: {
      fontSize: 16,
      color: colors.texts.primary,
      fontWeight: '500',
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    deleteButton: {
      padding: 4,
    },
    addIcon: {
      marginRight: 12,
    },
    addText: {
      fontSize: 16,
      color: colors.texts.primary,
      fontWeight: '500',
    },
  });

  if (isAddNew) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.leftSection}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={colors.texts.primary}
            style={styles.addIcon}
          />
          <Text style={styles.addText}>Добавить новую карту</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftSection}>
        <Ionicons
          name="card-outline"
          size={24}
          color={colors.texts.primary}
          style={styles.icon}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}>Карта **** {cardNumber}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        {onDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={colors.error.main}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PaymentMethodCard;
