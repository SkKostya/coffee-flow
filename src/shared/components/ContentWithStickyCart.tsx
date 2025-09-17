import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useStickyCartContext } from '../contexts/StickyCartContext';

interface ContentWithStickyCartProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const ContentWithStickyCart: React.FC<ContentWithStickyCartProps> = ({
  children,
  style,
}) => {
  const { cartHeight, isVisible } = useStickyCartContext();

  const containerStyle: ViewStyle = {
    ...style,
    paddingBottom: isVisible ? cartHeight : 0,
  };

  return <View style={containerStyle}>{children}</View>;
};

export default ContentWithStickyCart;
