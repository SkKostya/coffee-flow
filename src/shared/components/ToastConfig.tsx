import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '../hooks/useColors';

interface ToastConfigProps {
  type: 'success' | 'error' | 'info';
  text1?: string;
  text2?: string;
}

const ToastConfig: React.FC<ToastConfigProps> = ({ type, text1, text2 }) => {
  const colors = useColors();

  const getBorderColor = () => {
    if (type === 'error') {
      return colors.error.main;
    }
    if (type === 'success') {
      return colors.success.main;
    }
    return colors.primary.main;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgrounds.neutral,
      borderLeftColor: getBorderColor(),
      borderLeftWidth: 4,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 16,
      shadowColor: colors.texts.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
      minHeight: 60,
      justifyContent: 'center',
    },
    title: {
      color: colors.texts.primary,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: text2 ? 4 : 0,
    },
    message: {
      color: colors.texts.secondary,
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      {text1 && <Text style={styles.title}>{text1}</Text>}
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  );
};

export const toastConfig = {
  success: (props: any) => <ToastConfig type="success" {...props} />,
  error: (props: any) => <ToastConfig type="error" {...props} />,
  info: (props: any) => <ToastConfig type="info" {...props} />,
};
