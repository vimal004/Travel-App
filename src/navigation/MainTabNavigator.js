/**
 * MainTabNavigator.js — Bottom tab bar with two tabs: Explore & Favorites.
 * Custom styling for an elevated, rounded tab bar with accent colour indicators.
 */

import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FeedScreen from '../features/destinations/screens/FeedScreen';
import FavoritesScreen from '../features/favorites/screens/FavoritesScreen';
import { COLORS, FONTS, SIZES } from '../config/theme';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          }
          return <Ionicons name={iconName} size={SIZES.tabIconSize} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.secondaryText,
        tabBarLabelStyle: {
          fontFamily: FONTS.medium,
          fontSize: 11,
          marginTop: -2,
        },
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Explore" component={FeedScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
});

export default MainTabNavigator;
