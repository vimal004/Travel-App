/**
 * theme.js — Global design tokens for the travel app.
 * All colors, typography weights, spacing units, border radii, and
 * shadow presets are defined here so every screen stays consistent.
 */

const COLORS = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  primaryText: '#111827',
  secondaryText: '#6B7280',
  accent: '#4285F4',       // Google Blue
  accentDark: '#3367D6',
  error: '#EF4444',
  heart: '#EF4444',
  border: '#E5E7EB',
  overlay: 'rgba(0,0,0,0.45)',
  skeleton: '#E5E7EB',
  gradientStart: '#4285F4',
  gradientEnd: '#34A0F4',
  white: '#FFFFFF',
  black: '#000000',
  star: '#FBBF24',
};

const FONTS = {
  regular: 'GoogleSans-Regular',
  medium: 'GoogleSans-Medium',
  bold: 'GoogleSans-Bold',
};

const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,

  // Font sizes
  caption: 12,
  body: 14,
  subtitle: 16,
  title: 20,
  heading: 26,
  hero: 34,

  // Radii
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 999,

  // Layout
  cardHeight: 220,
  buttonHeight: 52,
  inputHeight: 54,
  iconSize: 24,
  tabIconSize: 22,
};

const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  button: {
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
};

export { COLORS, FONTS, SIZES, SHADOWS };
