import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useColors } from '../../src/shared/hooks/useColors';

const MOCK_MENU = [
  {
    id: '1',
    title: 'Капучино',
    price: '1200 ₸',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400',
  },
  {
    id: '2',
    title: 'Латте',
    price: '1300 ₸',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400',
  },
  {
    id: '3',
    title: 'Эспрессо',
    price: '900 ₸',
    image: 'https://images.unsplash.com/photo-1527169402691-a3fb27855702?w=400',
  },
];

const MOCK_REVIEWS = [
  {
    id: '1',
    author: 'Алия',
    rating: 5,
    text: 'Очень вкусный кофе и уютная атмосфера!',
  },
  {
    id: '2',
    author: 'Дмитрий',
    rating: 4,
    text: 'Хорошее место, но иногда бывают очереди.',
  },
];

export default function CoffeeShopScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams();

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgrounds.primary,
    },
    coffeeImage: {
      width: '100%',
      height: 180,
      borderRadius: 12,
      marginBottom: 15,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 10,
      color: colors.primary.main,
    },
    text: { fontSize: 16, textAlign: 'center', color: colors.texts.primary },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
      gap: 6,
    },
    button: {
      backgroundColor: colors.primary.main,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    buttonText: {
      color: colors.colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginTop: 20,
      marginBottom: 12,
      color: colors.texts.primary,
    },
    menuCard: {
      width: 140,
      backgroundColor: colors.backgrounds.secondary,
      borderRadius: 12,
      marginRight: 12,
      overflow: 'hidden',
    },
    menuImage: { width: '100%', height: 100 },
    menuInfo: { padding: 8 },
    menuTitle: { fontWeight: '600', color: colors.texts.primary },
    menuPrice: { color: colors.primary.main, marginTop: 4 },
    reviewCard: {
      backgroundColor: colors.backgrounds.secondary,
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
    },
    reviewAuthor: {
      fontWeight: '600',
      fontSize: 14,
      color: colors.texts.primary,
      marginBottom: 4,
      marginLeft: 4,
    },
    reviewText: { fontSize: 14, color: colors.texts.secondary },
    form: { marginTop: 10, marginBottom: 24 },
    input: {
      backgroundColor: colors.backgrounds.secondary,
      borderRadius: 8,
      padding: 12,
      color: colors.texts.primary,
      marginBottom: 8,
    },
    ratingRow: {
      flexDirection: 'row',
      gap: 2,
      justifyContent: 'flex-end',
      marginBottom: 12,
    },
    footerButton: {
      backgroundColor: colors.primary.main,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    footerButtonText: { color: colors.colors.white, fontWeight: '600' },
  });

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
      extraScrollHeight={300}
    >
      <ScrollView
        style={styles.container}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
        }}
      >
        <Stack.Screen
          options={{ headerShown: true, title: 'Кофейня Arabica' }}
        />

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
          }}
          style={styles.coffeeImage}
        />
        <Text style={styles.title}>Кофейня Arabica</Text>
        <Text style={styles.text}>ул. Абая, 10</Text>

        <View style={styles.row}>
          <Ionicons name="star" size={20} color={colors.primary.main} />
          <Text style={styles.text}>4.8 (200 отзывов)</Text>
        </View>

        <Text style={[styles.text, { marginTop: 10 }]}>Открыто до 22:00</Text>

        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Добавить в избранное</Text>
        </TouchableOpacity>

        {/* Секция Меню */}
        <Text style={styles.sectionTitle}>Меню</Text>
        <FlatList
          data={MOCK_MENU}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ height: 160 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.menuCard}>
              <Image source={{ uri: item.image }} style={styles.menuImage} />
              <View style={styles.menuInfo}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuPrice}>{item.price}</Text>
              </View>
            </View>
          )}
        />
        <TouchableOpacity
          style={[styles.button, { marginTop: 10 }]}
          onPress={() => router.navigate('/menu')}
        >
          <Text style={styles.buttonText}>Смотреть больше</Text>
        </TouchableOpacity>

        {/* Секция Отзывы */}
        <Text style={styles.sectionTitle}>Отзывы</Text>

        <View style={styles.form}>
          <TextInput
            placeholder="Ваш отзыв..."
            placeholderTextColor={colors.texts.secondary}
            style={styles.input}
            value={reviewText}
            onChangeText={setReviewText}
            numberOfLines={4}
            multiline
          />
          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
                <Ionicons
                  name="star"
                  size={28}
                  color={
                    i < rating ? colors.primary.main : colors.texts.secondary
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
              console.log('Отправляем отзыв:', { reviewText, rating });
              setReviewText('');
              setRating(0);
            }}
          >
            <Text style={styles.footerButtonText}>Отправить</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 40 }}>
          {MOCK_REVIEWS.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="person-circle"
                  size={20}
                  color={colors.primary.main}
                />
                <Text style={styles.reviewAuthor}>{review.author}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={16}
                    color={colors.primary.main}
                  />
                ))}
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
