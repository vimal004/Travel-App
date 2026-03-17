import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Animated, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isValidEmail } from '../../../utils/helpers';
import { useFavorites } from '../../favorites/context/FavoritesContext';

const M3_COLORS = {
  background: '#FFFFFF',
  surfaceVariant: '#F1F3F4',
  primary: '#0A56D1',
  onPrimary: '#FFFFFF',
  textPrimary: '#1F1F1F',
  textSecondary: '#444746',
  error: '#B3261E',
};

const M3TextInput = ({ icon, placeholder, secureTextEntry, value, onChangeText, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <View style={[styles.inputField, isFocused && styles.inputFieldFocused, error && styles.inputFieldError]}>
        <Ionicons name={icon} size={22} color={isFocused ? M3_COLORS.primary : M3_COLORS.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={M3_COLORS.textSecondary}
          secureTextEntry={secureTextEntry && !showPassword}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={M3_COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { loadUserFavorites } = useFavorites(); // Pull in context action

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (validate()) {
      try {
        const usersStr = await AsyncStorage.getItem('users_db');
        const users = usersStr ? JSON.parse(usersStr) : {};
        const normalizedEmail = email.toLowerCase().trim();
        const user = users[normalizedEmail];

        if (!user) {
          setErrors({ email: 'Account not found. Please create one.' });
          return;
        }

        if (user.password !== password) {
          setErrors({ password: 'Incorrect password. Try again.' });
          return;
        }

        // Establish a session that lasts for 2 hours (in milliseconds)
        const expiry = Date.now() + 2 * 60 * 60 * 1000;
        await AsyncStorage.setItem('session', JSON.stringify({ user: normalizedEmail, expiry }));
        await AsyncStorage.setItem('currentUser', normalizedEmail);

        // Load the specific favorites attached to this logged-in account
        await loadUserFavorites(normalizedEmail);

        // Login successful
        navigation.replace('Main');
      } catch (error) {
        console.error('Login Error:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
        <Ionicons name="arrow-back" size={26} color={M3_COLORS.textPrimary} />
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            
            <View style={styles.iconHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="compass" size={54} color={M3_COLORS.primary} />
              </View>
            </View>

            <View style={styles.header}>
              <Text style={styles.heroTitle}>Welcome back</Text>
              <Text style={styles.heroSubtitle}>Sign in to continue your next adventure.</Text>
            </View>

            <View style={styles.form}>
              <M3TextInput
                icon="mail-outline"
                placeholder="Email address"
                value={email}
                onChangeText={(t) => { setEmail(t); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
                error={errors.email}
              />
              <M3TextInput
                icon="lock-closed-outline"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={(t) => { setPassword(t); if (errors.password) setErrors((p) => ({ ...p, password: undefined })); }}
                error={errors.password}
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} activeOpacity={0.8}>
                <Text style={styles.primaryButtonText}>Sign in</Text>
              </TouchableOpacity>

              <View style={styles.signupPrompt}>
                <Text style={styles.promptText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.promptAction}>Create one</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: M3_COLORS.background },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 20, left: 20, zIndex: 10 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 32, paddingTop: 100, paddingBottom: 40 },
  iconHeader: { marginBottom: 30, alignItems: 'flex-start' },
  iconCircle: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 30, alignItems: 'flex-start' },
  heroTitle: { fontFamily: 'GoogleSans-Bold', fontSize: 36, color: M3_COLORS.textPrimary, letterSpacing: -0.5, marginBottom: 8 },
  heroSubtitle: { fontFamily: 'GoogleSans-Regular', fontSize: 16, color: M3_COLORS.textSecondary, lineHeight: 24 },
  form: { width: '100%' },
  inputContainer: { marginBottom: 20 },
  inputField: { flexDirection: 'row', alignItems: 'center', backgroundColor: M3_COLORS.surfaceVariant, borderRadius: 16, minHeight: 60, paddingHorizontal: 16, borderWidth: 2, borderColor: 'transparent' },
  inputFieldFocused: { borderColor: M3_COLORS.primary, backgroundColor: M3_COLORS.background },
  inputFieldError: { borderColor: M3_COLORS.error },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, fontFamily: 'GoogleSans-Regular', fontSize: 16, color: M3_COLORS.textPrimary, height: '100%' },
  errorText: { fontFamily: 'GoogleSans-Regular', fontSize: 12, color: M3_COLORS.error, marginTop: 6, marginLeft: 16 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 32 },
  forgotPasswordText: { fontFamily: 'GoogleSans-Medium', fontSize: 14, color: M3_COLORS.primary },
  primaryButton: { backgroundColor: M3_COLORS.primary, borderRadius: 100, height: 56, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  primaryButtonText: { fontFamily: 'GoogleSans-Medium', fontSize: 16, color: M3_COLORS.onPrimary },
  signupPrompt: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  promptText: { fontFamily: 'GoogleSans-Regular', fontSize: 14, color: M3_COLORS.textSecondary },
  promptAction: { fontFamily: 'GoogleSans-Medium', fontSize: 14, color: M3_COLORS.primary },
});

export default LoginScreen;