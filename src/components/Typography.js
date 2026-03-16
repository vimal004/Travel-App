/**
 * Typography.js — Reusable text component that enforces Google Sans
 * throughout the app. Accepts a `variant` prop to pick the right
 * font weight and size without scattering magic strings everywhere.
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../config/theme';

const VARIANT_MAP = {
  hero: { fontFamily: FONTS.bold, fontSize: SIZES.hero, color: COLORS.primaryText },
  heading: { fontFamily: FONTS.bold, fontSize: SIZES.heading, color: COLORS.primaryText },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.title, color: COLORS.primaryText },
  subtitle: { fontFamily: FONTS.medium, fontSize: SIZES.subtitle, color: COLORS.primaryText },
  body: { fontFamily: FONTS.regular, fontSize: SIZES.body, color: COLORS.primaryText },
  caption: { fontFamily: FONTS.regular, fontSize: SIZES.caption, color: COLORS.secondaryText },
  button: { fontFamily: FONTS.medium, fontSize: SIZES.subtitle, color: COLORS.white },
};

const Typography = ({ variant = 'body', style, children, ...rest }) => {
  const variantStyle = VARIANT_MAP[variant] || VARIANT_MAP.body;
  return (
    <Text style={[variantStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

export default Typography;
