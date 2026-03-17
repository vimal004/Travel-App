import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isValidEmail } from '../../../utils/helpers';

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
      <View
        style={[
          styles.inputField,
          isFocused && styles.inputFieldFocused,
          error && styles.inputFieldError,
        ]}
      >
        <Ionicons 
          name={icon} 
          size={22} 
          color={isFocused ? M3_COLORS.primary : M3_COLORS.textSecondary} 
          style={styles.inputIcon} 
        />
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={M3_COLORS.textSecondary}
          secureTextEntry={secureTextEntry && !showPassword}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={secureTextEntry || placeholder === "Email address" ? "none" : "words"}
          autoCorrect={false}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={M3_COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async () => {
    if (validate()) {
      try {
        // Save credentials to local storage
        await AsyncStorage.setItem('user_email', email.toLowerCase().trim());
        await AsyncStorage.setItem('user_password', password);
        await AsyncStorage.setItem('user_name', name.trim());
        
        navigation.replace('Main');
      } catch (error) {
        console.error('Failed to save user data:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Ionicons name="arrow-back" size={26} color={M3_COLORS.textPrimary} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          >
            <View style={styles.header}>
              <Text style={styles.heroTitle}>Create account</Text>
              <Text style={styles.heroSubtitle}>
                Join Wanderlust and start planning your perfect getaway.
              </Text>
            </View>

            <View style={styles.form}>
              <M3TextInput
                icon="person-outline"
                placeholder="Full name"
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                }}
                error={errors.name}
              />

              <M3TextInput
                icon="mail-outline"
                placeholder="Email address"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                error={errors.email}
              />
              
              <M3TextInput
                icon="lock-closed-outline"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                }}
                error={errors.password}
              />

              <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} activeOpacity={0.8}>
                <Text style={styles.primaryButtonText}>Sign up</Text>
              </TouchableOpacity>

              <View style={styles.signupPrompt}>
                <Text style={styles.promptText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.promptAction}>Sign in</Text>
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
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, left: 20, zIndex: 10 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32, paddingTop: 80, paddingBottom: 40 },
  header: { marginBottom: 40, alignItems: 'flex-start' },
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
  primaryButton: { backgroundColor: M3_COLORS.primary, borderRadius: 100, height: 56, justifyContent: 'center', alignItems: 'center', marginTop: 12, marginBottom: 24 },
  primaryButtonText: { fontFamily: 'GoogleSans-Medium', fontSize: 16, color: M3_COLORS.onPrimary },
  signupPrompt: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  promptText: { fontFamily: 'GoogleSans-Regular', fontSize: 14, color: M3_COLORS.textSecondary },
  promptAction: { fontFamily: 'GoogleSans-Medium', fontSize: 14, color: M3_COLORS.primary },
});

export default SignupScreen;