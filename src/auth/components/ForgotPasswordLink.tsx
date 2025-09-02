import { Button, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useColors } from '../../shared/hooks/useColors';

interface ForgotPasswordLinkProps {
  onPress: () => void;
}

const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ onPress }) => {
  const colors = useColors();

  // Фиксированные размеры для мобильных устройств
  const typography = { body: 16 };

  // Стили для контейнера
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 8,
  };

  // Стили для текста
  const textStyle: TextStyle = {
    color: colors.texts.secondary,
    fontSize: typography.body,
    lineHeight: typography.body * 1.4,
  };

  // Стили для кнопки
  const buttonStyle: TextStyle = {
    color: colors.colors.primary[500],
    fontSize: typography.body,
    fontWeight: '600',
    lineHeight: typography.body * 1.4,
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>Забыли пароль? </Text>
      <Button
        type="clear"
        onPress={onPress}
        buttonStyle={styles.button}
        titleStyle={buttonStyle}
        title="Сбросить пароль"
        activeOpacity={0.7}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    minHeight: 'auto',
  },
});

export default ForgotPasswordLink;
