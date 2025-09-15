import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useColors } from '../../shared';

interface CoffeeShopHeaderProps {
  name: string;
  address: string;
  logo: string;
  onBackPress: () => void;
  onSearchPress: () => void;
}

const CoffeeShopHeader: React.FC<CoffeeShopHeaderProps> = ({
  name,
  address,
  logo,
  onBackPress,
  onSearchPress,
}) => {
  const colors = useColors();

  const headerStyle: ViewStyle = {
    backgroundColor: colors.backgrounds.primary,
  };

  const textStyle = {
    color: colors.texts.primary,
  };

  const secondaryTextStyle = {
    color: colors.texts.secondary,
  };

  return (
    <View style={[styles.container, headerStyle]}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.texts.primary} />
        </TouchableOpacity>

        <View style={styles.coffeeShopInfo}>
          {logo && <Image source={{ uri: logo }} style={styles.logo} />}
          <View style={styles.textContainer}>
            <Text style={[styles.name, textStyle]}>{name}</Text>
            <Text style={[styles.address, secondaryTextStyle]}>{address}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
          <Ionicons name="search" size={24} color={colors.texts.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50, // для статус бара
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  coffeeShopInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    fontWeight: '400',
  },
  searchButton: {
    padding: 8,
    marginLeft: 12,
  },
});

export default CoffeeShopHeader;
