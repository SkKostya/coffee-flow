import {
  Button as RNEButton,
  ButtonProps as RNEButtonProps,
} from '@rneui/themed';
import React from 'react';
import { ViewStyle } from 'react-native';
import { useColors } from '../../shared/hooks/useColors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  disabled = false,
  loading = false,
}) => {
  const colors = useColors();

  const isDisabled = disabled || loading;

  // Определяем тип кнопки для React Native Elements
  const buttonType: RNEButtonProps['type'] =
    variant === 'primary' ? 'solid' : 'outline';

  // Определяем цвет кнопки
  const buttonColor = variant === 'primary' ? 'primary' : 'secondary';

  // Фиксированные размеры для мобильных устройств
  const buttonHeight = 48;
  const borderRadius = 12;
  const fontSize = 16;
  const gap = 16;

  // Стили для кнопки
  const buttonStyle: ViewStyle = {
    height: buttonHeight,
    borderRadius: borderRadius,
    ...style,
  };

  // Стили для текста
  const titleStyle = {
    fontSize: fontSize,
    lineHeight: fontSize,
    fontWeight: '600' as const,
    color:
      variant === 'primary' ? colors.texts.primary : colors.colors.primary[500],
  };

  // Стили для контейнера кнопки
  const containerStyle = {
    marginBottom: gap / 2,
    borderRadius: borderRadius,
    overflow: 'hidden' as const,
  };

  return (
    <RNEButton
      title={title}
      onPress={onPress}
      type={buttonType}
      color={buttonColor}
      disabled={isDisabled}
      loading={loading}
      buttonStyle={buttonStyle}
      titleStyle={titleStyle}
      containerStyle={containerStyle}
      activeOpacity={isDisabled ? 1 : 0.8}
      // Добавляем дополнительные пропсы для лучшего внешнего вида
      raised={variant === 'primary'}
      radius={borderRadius}
    />
  );
};

export default Button;
