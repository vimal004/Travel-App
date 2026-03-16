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
import { COLORS } from './src/config/theme';

export default function App() {
  // Load DM Sans — a clean geometric sans-serif very similar to Google Sans.
  // The font keys here must match the FONTS constants in theme.js.
  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': DMSans_400Regular,
    'GoogleSans-Medium': DMSans_500Medium,
    'GoogleSans-Bold': DMSans_700Bold,
  });

  // While fonts are loading, show a simple centered spinner.
  if (!fontsLoaded) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <FavoritesProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splash: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
