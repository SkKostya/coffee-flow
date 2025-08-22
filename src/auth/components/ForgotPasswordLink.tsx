import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getResponsiveTypography } from '../../shared/constants/responsiveStyles';
import useColors from '../../shared/hooks/useColors';
import useResponsive from '../../shared/hooks/useResponsive';

interface ForgotPasswordLinkProps {
  onPress: () => void;
}

const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ onPress }) => {
  const colors = useColors();
  const { currentBreakpoint } = useResponsive();

  const typography = getResponsiveTypography(currentBreakpoint);

  return (
    <View style={styles.forgotPasswordContainer}>
      <Text
        style={[
          styles.forgotPasswordText,
          {
            color: colors.texts.secondary,
            fontSize: typography.body,
          },
        ]}
      >
        Забыли пароль?{' '}
      </Text>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={[
            styles.forgotPasswordLink,
            {
              color: colors.colors.primary[500],
              fontSize: typography.body,
            },
          ]}
        >
          Сбросить пароль
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  forgotPasswordText: {
    // fontSize будет установлен динамически
  },
  forgotPasswordLink: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default ForgotPasswordLink;
