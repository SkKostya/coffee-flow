import React from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useColors } from '../../shared';
import type { CategoryTab } from '../types/categories';

interface CategoryHeaderProps {
  categories: CategoryTab[];
  activeCategoryId: string;
  onCategoryPress: (categoryId: string) => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  categories,
  activeCategoryId,
  onCategoryPress,
}) => {
  const colors = useColors();

  const animatedValues = React.useRef(
    (categories || []).reduce((acc, category) => {
      if (category.id) {
        acc[category.id] = new Animated.Value(
          category.id === activeCategoryId ? 1 : 0
        );
      }
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  // Анимация при изменении активной категории
  React.useEffect(() => {
    (categories || []).forEach((category) => {
      const animatedValue = animatedValues[category.id];
      if (animatedValue) {
        const isActive = category.id === activeCategoryId;
        Animated.timing(animatedValue, {
          toValue: isActive ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    });
  }, [activeCategoryId, categories, animatedValues]);

  // Проверяем, что categories существует и не пустой
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {categories
          .filter((category) => category.isVisible)
          .map((category) => {
            const animatedValue = animatedValues[category.id];

            // Проверяем, что animatedValue существует
            if (!animatedValue) {
              return null;
            }

            const backgroundColor = animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['transparent', colors.primary.main],
            });

            const borderColor = animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.borders.subtle, colors.primary.main],
            });

            const textColor = animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.texts.secondary, colors.texts.primary],
            });

            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => onCategoryPress(category.id)}
              >
                <Animated.View
                  style={[
                    styles.tab,
                    {
                      backgroundColor,
                      borderColor,
                    },
                  ]}
                >
                  <Animated.Text
                    style={[
                      styles.tabText,
                      {
                        color: textColor,
                      },
                    ]}
                  >
                    {category.name}
                  </Animated.Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 'auto',
  },
  tabText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CategoryHeader;
