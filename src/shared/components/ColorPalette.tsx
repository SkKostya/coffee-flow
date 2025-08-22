import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../constants/Colors';
import useColors from '../hooks/useColors';

interface ColorSwatchProps {
  name: string;
  color: string;
  onPress?: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, color, onPress }) => {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[
        styles.swatch,
        {
          backgroundColor: colors.backgrounds.elevated,
          shadowColor: colors.shadows.medium,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.colorBox,
          {
            backgroundColor: color,
            borderColor: colors.borders.primary,
          },
        ]}
      />
      <Text style={[styles.colorName, { color: colors.texts.primary }]}>
        {name}
      </Text>
      <Text style={[styles.colorHex, { color: colors.texts.secondary }]}>
        {color}
      </Text>
    </TouchableOpacity>
  );
};

interface ColorPaletteSectionProps {
  title: string;
  colors: Record<string, string>;
  onColorPress?: (color: string) => void;
}

const ColorPaletteSection: React.FC<ColorPaletteSectionProps> = ({
  title,
  colors,
  onColorPress,
}) => {
  const colorsHook = useColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colorsHook.text }]}>
        {title}
      </Text>
      <View style={styles.colorGrid}>
        {Object.entries(colors).map(([shade, color]) => (
          <ColorSwatch
            key={shade}
            name={shade}
            color={color}
            onPress={() => onColorPress?.(color)}
          />
        ))}
      </View>
    </View>
  );
};

interface ColorPaletteProps {
  onColorSelect?: (color: string) => void;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ onColorSelect }) => {
  const colors = useColors();

  const handleColorPress = (color: string) => {
    onColorSelect?.(color);
    // В реальном приложении здесь можно добавить копирование в буфер обмена
    console.log('Selected color:', color);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Color Palette</Text>

      <ColorPaletteSection
        title="Primary Colors (Orange/Brown)"
        colors={Colors.primary}
        onColorPress={handleColorPress}
      />

      <ColorPaletteSection
        title="Secondary Colors (Blue)"
        colors={Colors.secondary}
        onColorPress={handleColorPress}
      />

      <ColorPaletteSection
        title="Success Colors (Green)"
        colors={Colors.success}
        onColorPress={handleColorPress}
      />

      <ColorPaletteSection
        title="Error Colors (Red)"
        colors={Colors.error}
        onColorPress={handleColorPress}
      />

      <ColorPaletteSection
        title="Neutral Colors (Grayscale)"
        colors={Colors.neutral}
        onColorPress={handleColorPress}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utility Colors</Text>
        <View style={styles.colorGrid}>
          <ColorSwatch
            name="Background"
            color={Colors.background}
            onPress={() => handleColorPress(Colors.background)}
          />
          <ColorSwatch
            name="White"
            color={Colors.white}
            onPress={() => handleColorPress(Colors.white)}
          />
          <ColorSwatch
            name="Black"
            color={Colors.black}
            onPress={() => handleColorPress(Colors.black)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  swatch: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
  },
  colorName: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  colorHex: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default ColorPalette;
