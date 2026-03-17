/**
 * App.js — Entry point for the Wanderlust travel app.
 *
 * Responsibilities:
 * 1. Load DM Sans fonts (closest open-source match to Google Sans)
 *    via @expo-google-fonts/dm-sans
 * 2. Show a splash screen while fonts load
 * 3. Wrap the app in FavoritesProvider (Context) + NavigationContainer
 * 4. Render the RootNavigator
 */

import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FavoritesProvider } from './src/features/favorites/context/FavoritesContext';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/config/ThemeContext';
import { COLORS } from './src/config/theme';

const MainApp = () => {
  const { colors } = useTheme();
  
  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': require('./src/assets/fonts/GoogleSans-Regular.ttf'),
    'GoogleSans-Medium': require('./src/assets/fonts/GoogleSans-Medium.ttf'),
    'GoogleSans-Bold': require('./src/assets/fonts/GoogleSans-Bold.ttf'),
  });

  // While fonts are loading, show a simple centered spinner.
  if (!fontsLoaded) {
    return (
      <View style={[styles.splash, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <FavoritesProvider>
          <MainApp />
        </FavoritesProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
