/**
 * LoginScreen.js — Premium login screen with gradient header,
 * polished inputs, inline validation, and a pill-shaped CTA.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../../components/Typography';
import PremiumButton from '../../../components/PremiumButton';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../../config/theme';
import { isValidEmail } from '../../../utils/helpers';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [secureEntry, setSecureEntry] = useState(true);

  // Simple fade-in animation for the form card
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Pre-fill credentials for the user to make it easier
  const handleQuickLogin = () => {
    setEmail('traveler@wanderlust.com');
    setPassword('explorer2026');
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      // Navigate to the main app flow (replace so back-button can't return here)
      navigation.replace('Main');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        {/* Gradient header background */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Ionicons name="airplane" size={48} color="rgba(255,255,255,0.9)" />
          <Typography variant="hero" style={styles.heroText}>
            Wanderlust
          </Typography>
          <Typography variant="body" style={styles.tagline}>
            Discover your next adventure
          </Typography>
        </LinearGradient>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formArea}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.card,
                SHADOWS.card,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <Typography variant="title" style={styles.cardTitle}>
                Sign In
              </Typography>
              <Typography variant="caption" style={styles.cardSubtitle}>
                Enter your credentials to continue
              </Typography>

              {/* Email input */}
              <View style={styles.inputGroup}>
                <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.secondaryText} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor={COLORS.secondaryText}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                  />
                </View>
                {errors.email && (
                  <Typography variant="caption" style={styles.errorText}>
                    {errors.email}
                  </Typography>
                )}
              </View>

              {/* Password input */}
              <View style={styles.inputGroup}>
                <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.secondaryText} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={COLORS.secondaryText}
                    secureTextEntry={secureEntry}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    textContentType="password"
                    value={password}
                    onChangeText={(t) => {
                      setPassword(t);
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                    }}
                  />
                  <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons
                      name={secureEntry ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={COLORS.secondaryText}
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Typography variant="caption" style={styles.errorText}>
                    {errors.password}
                  </Typography>
                )}
              </View>

              {/* Login button */}
              <PremiumButton title="Continue" onPress={handleLogin} style={styles.loginBtn} />

              {/* Demo Login Option */}
              <TouchableOpacity onPress={handleQuickLogin} style={styles.demoLink}>
                <Typography variant="caption" style={styles.demoText}>
                  Want to skip the form? <Typography variant="caption" style={{ color: COLORS.accent, fontWeight: 'bold' }}>Use Demo Account</Typography>
                </Typography>
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Typography variant="caption" style={styles.footerText}>
                  Don't have an account?{' '}
                </Typography>
                <TouchableOpacity onPress={() => {}}>
                  <Typography variant="caption" style={[styles.footerText, { color: COLORS.accent, fontWeight: 'bold' }]}>
                    Sign Up
                  </Typography>
                </TouchableOpacity>
              </View>

              <Typography variant="caption" style={[styles.footerText, { marginTop: 24, fontSize: 10, opacity: 0.6 }]}>
                By continuing, you agree to our Terms & Privacy Policy
              </Typography>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  heroText: {
    color: COLORS.white,
    marginTop: 12,
    fontSize: 36,
    letterSpacing: 1,
  },
  tagline: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    fontSize: 15,
  },
  formArea: {
    flex: 1,
    marginTop: -40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.xl,
    paddingTop: 28,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSubtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    borderColor: 'transparent',
    height: SIZES.inputHeight,
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 2,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.primaryText,
    paddingVertical: 0, // Ensure no extra padding blocks text visibility
  },
  demoLink: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 10,
  },
  demoText: {
    color: COLORS.secondaryText,
  },
  errorText: {
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
  },

  loginBtn: {
    marginTop: 8,
    marginBottom: 16,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
});

export default LoginScreen;
