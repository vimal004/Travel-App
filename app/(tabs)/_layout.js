import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FONTS, SIZES } from '../../src/config/theme';
import { useTheme } from '../../src/config/ThemeContext';

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          }
          return <Ionicons name={iconName} size={SIZES.tabIconSize} color={color} />;
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarLabelStyle: {
          fontFamily: FONTS.medium,
          fontSize: 11,
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          paddingTop: 8,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          height: Platform.OS === 'ios' ? 88 : 64 + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? 28 : (insets.bottom > 0 ? insets.bottom : 8),
        },
      })}
    >
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
    </Tabs>
  );
}
