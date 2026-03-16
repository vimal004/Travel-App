/**
 * ScreenWrapper.js — Consistent top-level wrapper for every screen.
 * Handles SafeAreaView, background color, and optional padding
 * so individual screens don't duplicate boiler-plate layout code.
 */

import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../config/theme';

const ScreenWrapper = ({ children, style, edges = ['top', 'left', 'right'], noPadding = false }) => {
  return (
    <SafeAreaView edges={edges} style={[styles.safe, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={[styles.container, noPadding && { paddingHorizontal: 0 }]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default ScreenWrapper;
