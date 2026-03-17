/**
 * PremiumButton.js — Pill-shaped button with a gradient background
 * and subtle shadow. Used for primary CTAs throughout the app.
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Typography from './Typography';
import { SIZES, SHADOWS } from '../config/theme';
import { useTheme } from '../config/ThemeContext';

const PremiumButton = ({ title, onPress, loading = false, style, textStyle }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { colors } = useTheme();

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={loading}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, SHADOWS.button]}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Typography variant="button" style={[styles.text, textStyle, { color: colors.white }]}>
              {title}
            </Typography>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.xxl,
  },
  text: {
    letterSpacing: 0.5,
  },
});

export default PremiumButton;
