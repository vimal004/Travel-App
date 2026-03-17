/**
 * Typography.js — Reusable text component that enforces Google Sans
 * throughout the app. Accepts a `variant` prop to pick the right
 * font weight and size without scattering magic strings everywhere.
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { FONTS, SIZES } from '../config/theme';
import { useTheme } from '../config/ThemeContext';

const getVariantMap = (colors) => ({
  hero: { fontFamily: FONTS.bold, fontSize: SIZES.hero, color: colors.primaryText },
  heading: { fontFamily: FONTS.bold, fontSize: SIZES.heading, color: colors.primaryText },
  title: { fontFamily: FONTS.bold, fontSize: SIZES.title, color: colors.primaryText },
  subtitle: { fontFamily: FONTS.medium, fontSize: SIZES.subtitle, color: colors.primaryText },
  body: { fontFamily: FONTS.regular, fontSize: SIZES.body, color: colors.primaryText },
  caption: { fontFamily: FONTS.regular, fontSize: SIZES.caption, color: colors.secondaryText },
  button: { fontFamily: FONTS.medium, fontSize: SIZES.subtitle, color: colors.white },
});

const Typography = ({ variant = 'body', style, children, ...rest }) => {
  const { colors } = useTheme();
  const variantMap = getVariantMap(colors);
  const variantStyle = variantMap[variant] || variantMap.body;
  return (
    <Text style={[variantStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

export default Typography;
