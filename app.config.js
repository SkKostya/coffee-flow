import 'dotenv/config';

export default {
  expo: {
    name: 'coffee-flow',
    slug: 'coffee-flow',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'coffeeflow',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#373737',
      },
      edgeToEdgeEnabled: true,
      package: 'com.anonymous.coffeeflow',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 153,
          resizeMode: 'contain',
          backgroundColor: '#373737',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
