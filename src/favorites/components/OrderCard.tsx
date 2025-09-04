import { Button, Card, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useColors } from '../../shared';
import type { Order } from '../types';

interface OrderCardProps {
  order: Order;
  onDetailsPress: () => void;
  onRepeatPress: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onDetailsPress,
  onRepeatPress,
}) => {
  const colors = useColors();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.backgrounds.neutral,
    borderRadius: 12,
    marginHorizontal: 0,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borders.subtle,
  };

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('ru-RU')} 〒`;
  };

  const getOrderItemsText = (): string => {
    if (order.items.length === 0) return '';
    if (order.items.length === 1) return order.items[0].name;
    if (order.items.length === 2) {
      return `${order.items[0].name}, ${order.items[1].name}`;
    }
    return `${order.items[0].name}, ${order.items[1].name} +${
      order.items.length - 2
    }`;
  };

  return (
    <Card containerStyle={cardStyle}>
      {/* Заголовок с названием заказа и кофейни */}
      <View style={styles.header}>
        <Text style={[styles.orderTitle, { color: colors.texts.primary }]}>
          {getOrderItemsText()}
        </Text>
        <Text style={[styles.separator, { color: colors.texts.secondary }]}>
          |
        </Text>
        <Text
          style={[styles.coffeeShopName, { color: colors.texts.secondary }]}
        >
          {order.coffeeShopName}
        </Text>
      </View>

      {/* Адрес кофейни */}
      <Text style={[styles.address, { color: colors.texts.secondary }]}>
        {order.coffeeShopAddress}
      </Text>

      {/* Нижняя часть с кнопками и ценой */}
      <View style={styles.footer}>
        <Button
          title="Подробнее"
          type="outline"
          color="primary"
          size="sm"
          buttonStyle={[
            styles.detailsButton,
            {
              borderColor: colors.primary.main,
              backgroundColor: colors.backgrounds.neutral,
            },
          ]}
          titleStyle={[styles.buttonText, { color: colors.primary.main }]}
          onPress={onDetailsPress}
        />

        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.texts.primary }]}>
            {formatPrice(order.total)}
          </Text>
        </View>

        <Button
          title="Повторить"
          type="solid"
          color="primary"
          size="sm"
          buttonStyle={[
            styles.repeatButton,
            { backgroundColor: colors.primary.main },
          ]}
          titleStyle={[styles.buttonText, { color: colors.texts.primary }]}
          onPress={onRepeatPress}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  coffeeShopName: {
    fontSize: 14,
    fontWeight: '400',
  },
  address: {
    fontSize: 14,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
  },
  repeatButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceContainer: {
    marginLeft: 'auto',
    marginRight: 12,
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderCard;
