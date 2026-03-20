import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments, Slot } from 'expo-router';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FavoritesProvider } from '../src/features/favorites/context/FavoritesContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../src/config/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// We create an internal component to handle theme colors and routing logic
function RootLayoutNav() {
  const { colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionStr = await AsyncStorage.getItem('session');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (Date.now() < session.expiry) {
            router.replace('/(tabs)/explore');
          } else {
            await AsyncStorage.removeItem('session');
            await AsyncStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Session check:', error);
      } finally {
        setIsReady(true);
      }
    };
    if (!isReady) {
       checkSession();
    }
  }, [isReady, router]);

  if (!isReady) {
    return (
      <View style={[styles.splash, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent || '#000'} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="detail/[id]" options={{ presentation: 'modal', animation: 'slide_from_right' }} />
      <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'GoogleSans-Regular': require('../src/assets/fonts/GoogleSans-Regular.ttf'),
    'GoogleSans-Medium': require('../src/assets/fonts/GoogleSans-Medium.ttf'),
    'GoogleSans-Bold': require('../src/assets/fonts/GoogleSans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <ThemeProvider>
          <FavoritesProvider>
            <RootLayoutNav />
          </FavoritesProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
