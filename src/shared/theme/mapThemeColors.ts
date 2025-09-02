import Colors from '../constants/Colors';

export const lightMapTheme = [
  {
    elementType: 'geometry',
    stylers: [{ color: Colors.primary[50] }], // primary.50
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: Colors.primary[900] }], // primary.900
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: Colors.white }], // white
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: Colors.primary[200] }], // primary.200
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: Colors.primary[500] }], // primary.500
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: Colors.secondary[100] }], // secondary.100
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: Colors.primary[100] }], // primary.100
  },
];

export const darkMapTheme = [
  {
    elementType: 'geometry',
    stylers: [{ color: Colors.background }], // background
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: Colors.neutral[50] }], // neutral.50
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: Colors.neutral[900] }], // neutral.900
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: Colors.primary[800] }], // primary.800
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: Colors.primary[500] }], // primary.500 (акцент)
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: Colors.secondary[800] }], // secondary.800
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: Colors.neutral[700] }], // neutral.700
  },
];
