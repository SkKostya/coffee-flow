import { Ionicons } from '@expo/vector-icons';
import { Button, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '../../shared';

interface EmptyFavoritesStateProps {
  type: 'products' | 'orders' | 'all';
  onActionPress?: () => void;
}

const EmptyFavoritesState: React.FC<EmptyFavoritesStateProps> = ({
  type,
  onActionPress,
}) => {
  const colors = useColors();

  const getContent = () => {
    switch (type) {
      case 'products':
        return {
          icon: 'heart-outline' as const,
          title: 'Нет избранных продуктов',
          subtitle: 'Добавьте продукты в избранное, чтобы они появились здесь',
          actionText: 'Перейти к меню',
        };
      case 'orders':
        return {
          icon: 'receipt-outline' as const,
          title: 'Нет избранных заказов',
          subtitle: 'Добавьте заказы в избранное, чтобы быстро их повторить',
          actionText: 'История заказов',
        };
      case 'all':
        return {
          icon: 'heart-outline' as const,
          title: 'Избранное пусто',
          subtitle: 'Обновите избранное или добавьте продукты и заказы',
          actionText: 'Обновить',
        };
    }
  };

  const content = getContent();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.backgrounds.secondary },
        ]}
      >
        <Ionicons
          name={content.icon}
          size={48}
          color={colors.texts.secondary}
        />
      </View>

      <Text style={[styles.title, { color: colors.texts.primary }]}>
        {content.title}
      </Text>

      <Text style={[styles.subtitle, { color: colors.texts.secondary }]}>
        {content.subtitle}
      </Text>

      {onActionPress && (
        <Button
          title={content.actionText}
          type="solid"
          color="primary"
          buttonStyle={[
            styles.actionButton,
            { backgroundColor: colors.primary.main },
          ]}
          titleStyle={[
            styles.actionButtonText,
            { color: colors.texts.primary },
          ]}
          onPress={onActionPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EmptyFavoritesState;
