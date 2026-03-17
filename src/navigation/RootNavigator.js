/**
 * RootNavigator.js — Top-level navigation stack.
 * Login → (replace) Main Tabs → Detail (push).
 * Uses Native Stack for performance (native navigation transitions).
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import DetailScreen from '../features/destinations/screens/DetailScreen';
import SignupScreen from '../features/auth/screens/SignupScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom', // smooth transition between screens
      }}
    >
      {/* Auth flow */}
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

export default RootNavigator;
