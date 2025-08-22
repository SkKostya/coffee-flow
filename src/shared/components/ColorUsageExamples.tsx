import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useColors from '../hooks/useColors';

const ColorUsageExamples: React.FC = () => {
  const colors = useColors();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Color Usage Examples
      </Text>

      {/* Primary Colors Usage */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Primary Colors
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary.main }]}
          >
            <Text
              style={[styles.buttonText, { color: colors.primary.contrast }]}
            >
              Primary Button
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary.light }]}
          >
            <Text style={[styles.buttonText, { color: colors.primary.dark }]}>
              Light Primary
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary.dark }]}
          >
            <Text
              style={[styles.buttonText, { color: colors.primary.contrast }]}
            >
              Dark Primary
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Secondary Colors Usage */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Secondary Colors
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.secondary.main }]}
          >
            <Text
              style={[styles.buttonText, { color: colors.secondary.contrast }]}
            >
              Secondary Button
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.secondary.light }]}
          >
            <Text style={[styles.buttonText, { color: colors.secondary.dark }]}>
              Light Secondary
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Colors Usage */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Status Colors
        </Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: colors.status.success },
            ]}
          >
            <Text style={[styles.statusText, { color: colors.text }]}>
              Success
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: colors.status.error },
            ]}
          >
            <Text style={[styles.statusText, { color: colors.text }]}>
              Error
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: colors.status.warning },
            ]}
          >
            <Text style={[styles.statusText, { color: colors.text }]}>
              Warning
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: colors.status.info },
            ]}
          >
            <Text style={[styles.statusText, { color: colors.text }]}>
              Info
            </Text>
          </View>
        </View>
      </View>

      {/* Background Variations */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Background Variations
        </Text>

        <View style={styles.backgroundRow}>
          <View
            style={[
              styles.backgroundBox,
              { backgroundColor: colors.backgrounds.primary },
            ]}
          >
            <Text
              style={[styles.backgroundText, { color: colors.texts.inverse }]}
            >
              Primary
            </Text>
          </View>

          <View
            style={[
              styles.backgroundBox,
              { backgroundColor: colors.backgrounds.secondary },
            ]}
          >
            <Text
              style={[styles.backgroundText, { color: colors.texts.primary }]}
            >
              Secondary
            </Text>
          </View>

          <View
            style={[
              styles.backgroundBox,
              { backgroundColor: colors.backgrounds.tertiary },
            ]}
          >
            <Text
              style={[styles.backgroundText, { color: colors.texts.primary }]}
            >
              Tertiary
            </Text>
          </View>

          <View
            style={[
              styles.backgroundBox,
              { backgroundColor: colors.backgrounds.elevated },
            ]}
          >
            <Text
              style={[styles.backgroundText, { color: colors.texts.primary }]}
            >
              Elevated
            </Text>
          </View>
        </View>
      </View>

      {/* Text Variations */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Text Variations
        </Text>

        <View style={styles.textRow}>
          <Text style={[styles.textExample, { color: colors.texts.primary }]}>
            Primary Text
          </Text>

          <Text style={[styles.textExample, { color: colors.texts.secondary }]}>
            Secondary Text
          </Text>

          <Text style={[styles.textExample, { color: colors.texts.disabled }]}>
            Disabled Text
          </Text>

          <Text style={[styles.textExample, { color: colors.texts.inverse }]}>
            Inverse Text
          </Text>
        </View>
      </View>

      {/* Border Examples */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Border Examples
        </Text>

        <View style={styles.borderRow}>
          <View
            style={[styles.borderBox, { borderColor: colors.borders.primary }]}
          >
            <Text style={[styles.borderText, { color: colors.text }]}>
              Primary Border
            </Text>
          </View>

          <View
            style={[styles.borderBox, { borderColor: colors.borders.focus }]}
          >
            <Text style={[styles.borderText, { color: colors.text }]}>
              Focus Border
            </Text>
          </View>

          <View
            style={[styles.borderBox, { borderColor: colors.borders.error }]}
          >
            <Text style={[styles.borderText, { color: colors.text }]}>
              Error Border
            </Text>
          </View>
        </View>
      </View>

      {/* Color with Opacity Example */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Color with Opacity
        </Text>

        <View style={styles.opacityRow}>
          <View
            style={[
              styles.opacityBox,
              {
                backgroundColor: colors.getColorWithOpacity(
                  colors.primary.main,
                  0.1
                ),
              },
            ]}
          >
            <Text style={[styles.opacityText, { color: colors.primary.main }]}>
              10% Opacity
            </Text>
          </View>

          <View
            style={[
              styles.opacityBox,
              {
                backgroundColor: colors.getColorWithOpacity(
                  colors.primary.main,
                  0.3
                ),
              },
            ]}
          >
            <Text style={[styles.opacityText, { color: colors.primary.main }]}>
              30% Opacity
            </Text>
          </View>

          <View
            style={[
              styles.opacityBox,
              {
                backgroundColor: colors.getColorWithOpacity(
                  colors.primary.main,
                  0.6
                ),
              },
            ]}
          >
            <Text style={[styles.opacityText, { color: colors.primary.main }]}>
              60% Opacity
            </Text>
          </View>
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
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  backgroundRow: {
    gap: 12,
  },
  backgroundBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  backgroundText: {
    fontSize: 14,
    fontWeight: '500',
  },
  textRow: {
    gap: 8,
  },
  textExample: {
    fontSize: 16,
    fontWeight: '500',
  },
  borderRow: {
    gap: 12,
  },
  borderBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'solid',
  },
  borderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  opacityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  opacityBox: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  opacityText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ColorUsageExamples;
