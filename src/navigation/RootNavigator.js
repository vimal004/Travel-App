/**
 * RootNavigator.js — Top-level navigation stack.
 * Checks session on load: Login → (replace) Main Tabs → Detail (push).
 * Uses Native Stack for performance (native navigation transitions).
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../features/auth/screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import DetailScreen from '../features/destinations/screens/DetailScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';
import WelcomeScreen from '../features/auth/screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Welcome');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionStr = await AsyncStorage.getItem('session');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          // Check if session is still valid (has not passed the 2-hour expiry)
          if (Date.now() < session.expiry) {
            setInitialRoute('Main');
          } else {
            // Session expired, clean up stored auth state
            await AsyncStorage.removeItem('session');
            await AsyncStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A56D1" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom', // smooth transition between screens
      }}
    >
      {/* Auth flow */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      {/* Main app (tabs) */}
      <Stack.Screen name="Main" component={MainTabNavigator} />

      {/* Detail modal/screen (pushed on top of tabs) */}
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default RootNavigator;