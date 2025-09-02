import { Stack } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '../src/shared/hooks/useColors';

export default function OnboardingScreen({ navigation }: any) {
  const colors = useColors();

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgrounds.primary },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    image: { width: 120, height: 120, marginBottom: 20 },
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 10,
      color: colors.primary.main,
    },
    text: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 30,
      color: colors.texts.secondary,
    },
    button: {
      backgroundColor: colors.primary.main,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    buttonText: { color: colors.colors.white, fontSize: 16, fontWeight: '600' },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{ headerShown: true, title: 'Добро пожаловать' }}
      />
      <View style={styles.content}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/744/744465.png',
          }}
          style={styles.image}
        />
        <Text style={styles.title}>Добро пожаловать!</Text>
        <Text style={styles.text}>
          CoffeeFlow помогает заказывать кофе без очередей.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.buttonText}>Продолжить</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
