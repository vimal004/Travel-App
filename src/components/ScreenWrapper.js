/**
 * ScreenWrapper.js — Consistent top-level wrapper for every screen.
 * Handles SafeAreaView, background color, and optional padding
 * so individual screens don't duplicate boiler-plate layout code.
 */

import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../config/ThemeContext';

const ScreenWrapper = ({ children, style, edges = ['top', 'left', 'right'], noPadding = false }) => {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView edges={edges} style={[styles.safe, style]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <View style={[styles.container, noPadding && { paddingHorizontal: 0 }]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default ScreenWrapper;
