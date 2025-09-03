import { Ionicons } from '@expo/vector-icons';
import { Button, Text } from '@rneui/themed';
import { router, Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useColors } from '../hooks/useColors';

interface FormScreenProps {
  title: string;
  children: React.ReactNode;
  saveButtonText: string;
  onSave: () => void;
  isValid?: boolean;
  hasChanges?: boolean;
  isSubmitting?: boolean;
  formError?: string;
  showBackButton?: boolean;
}

const FormScreen: React.FC<FormScreenProps> = ({
  title,
  children,
  saveButtonText,
  onSave,
  isValid = true,
  hasChanges = true,
  isSubmitting = false,
  formError,
  showBackButton = true,
}) => {
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgrounds.primary,
    },
    header: {
      paddingTop: 42,
      paddingBottom: 18,
      marginBottom: 16,
      backgroundColor: colors.backgrounds.neutral,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.texts.primary,
      marginLeft: 12,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    formContainer: {
      marginBottom: 32,
    },
    errorText: {
      color: colors.error.main,
      fontSize: 14,
      marginTop: 8,
      marginBottom: 16,
      textAlign: 'center',
    },
    saveButton: {
      backgroundColor: colors.primary.main,
      paddingVertical: 12,
    },
    saveButtonText: {
      color: colors.texts.primary,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {showBackButton && (
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.texts.primary}
              onPress={() => router.back()}
            />
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>{children}</View>

        {/* Form Error */}
        {formError && <Text style={styles.errorText}>{formError}</Text>}

        {/* Save Button */}
        <Button
          title={saveButtonText}
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonText}
          onPress={onSave}
          disabled={!isValid || !hasChanges || isSubmitting}
          loading={isSubmitting}
        />
      </ScrollView>
    </View>
  );
};

export default FormScreen;
