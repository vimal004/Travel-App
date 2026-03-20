import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { useTheme } from '../../../config/ThemeContext';

const WelcomeScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();

    // Continuous floating animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -15, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, floatAnim]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* Visual Header replacing the animation */}
      <View style={styles.heroContainer}>
        <LinearGradient
          colors={isDarkMode ? ['#1A237E', '#3F51B5', colors.background] : ['#E3F2FD', '#BBDEFB', colors.background]}
          style={styles.gradient}
        />
        <Animated.View style={[styles.iconWrapper, { transform: [{ translateY: floatAnim }] }]}>
          <View style={styles.iconCircle}>
            <Ionicons name="airplane" size={64} color={colors.primary} style={styles.icon} />
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>Wanderlust</Text>
        <Text style={styles.subtitle}>
          Discover your next adventure. Plan, explore, and organize your trips seamlessly.
        </Text>

        <TouchableOpacity 
          style={styles.primaryButton} 
          activeOpacity={0.8}
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          activeOpacity={0.8}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  heroContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  iconWrapper: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  iconCircle: {
    width: 140,
    height: 140,
    backgroundColor: colors.surface,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    transform: [{ rotate: '-45deg' }, { translateX: 5 }, { translateY: -5 }], // Make the plane point upwards
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'GoogleSans-Bold',
    fontSize: 40,
    color: colors.primaryText,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'GoogleSans-Regular',
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    width: '100%',
    borderRadius: 100,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontFamily: 'GoogleSans-Medium',
    fontSize: 16,
    color: colors.onPrimary || '#FFFFFF',
  },
  secondaryButton: {
    width: '100%',
    borderRadius: 100,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
  },
  secondaryButtonText: {
    fontFamily: 'GoogleSans-Medium',
    fontSize: 16,
    color: colors.primaryText,
  },
});

export default WelcomeScreen;