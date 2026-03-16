/**
 * DetailScreen.js — Full destination detail view.
 *
 * Uses react-native-reanimated for entrance animations:
 *  • Hero image scales from 1.1 → 1 on mount (zoom-settle effect)
 *  • Info card slides up from below and fades in
 *  • FAB pops in with spring physics
 *
 * A FloatingActionButton lets the user toggle the item as a favourite.
 */

import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../../components/Typography';
import { COLORS, SIZES, SHADOWS, FONTS } from '../../../config/theme';
import { useFavorites } from '../../favorites/context/FavoritesContext';
import { formatCurrency } from '../../../utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DetailScreen = ({ route, navigation }) => {
  const { destination } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(destination.id);

  // ─── Reanimated shared values ───
  // Hero image starts slightly zoomed and settles to normal
  const heroScale = useSharedValue(1.1);
  // Info card starts below and transparent, slides into place
  const infoTranslateY = useSharedValue(60);
  const infoOpacity = useSharedValue(0);
  // FAB starts at scale 0 and springs in
  const fabScale = useSharedValue(0);

  React.useEffect(() => {
    // Hero zoom-settle (500ms ease-out)
    heroScale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    // Info card slide-up with a slight delay (300ms delay, 500ms duration)
    infoTranslateY.value = withDelay(200, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
    infoOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    // FAB pops in after the card settles (500ms delay, spring physics)
    fabScale.value = withDelay(500, withSpring(1, { damping: 12, stiffness: 150 }));
  }, []);

  // ─── Animated styles ───
  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }],
  }));

  const infoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: infoTranslateY.value }],
    opacity: infoOpacity.value,
  }));

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  return (
    <View style={styles.root}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Hero Image with zoom-settle animation */}
        <View style={styles.heroContainer}>
          <Animated.Image
            source={{ uri: destination.image }}
            style={[styles.heroImage, heroAnimatedStyle]}
            resizeMode="cover"
          />
          {/* Overlay gradient for readability */}
          <View style={styles.heroOverlay} />

          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Info section slides up */}
        <Animated.View style={[styles.infoCard, SHADOWS.card, infoAnimatedStyle]}>
          {/* Title row */}
          <View style={styles.titleRow}>
            <Typography variant="heading" style={styles.name}>
              {destination.name}
            </Typography>
            {destination.rating != null && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color={COLORS.star} />
                <Typography variant="caption" style={styles.ratingText}>
                  {Number(destination.rating).toFixed(1)}
                </Typography>
              </View>
            )}
          </View>

          {/* Location */}
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={16} color={COLORS.accent} />
            <Typography variant="body" style={styles.locationText}>
              {destination.country || 'Unknown location'}
            </Typography>
          </View>

          {/* Chips row */}
          <View style={styles.chipsRow}>
            {destination.climate && (
              <View style={styles.chip}>
                <Ionicons name="partly-sunny-outline" size={14} color={COLORS.accent} />
                <Typography variant="caption" style={styles.chipText}>
                  {destination.climate}
                </Typography>
              </View>
            )}
            {destination.currency && (
              <View style={styles.chip}>
                <Ionicons name="cash-outline" size={14} color={COLORS.accent} />
                <Typography variant="caption" style={styles.chipText}>
                  {destination.currency}
                </Typography>
              </View>
            )}
            {destination.language && (
              <View style={styles.chip}>
                <Ionicons name="globe-outline" size={14} color={COLORS.accent} />
                <Typography variant="caption" style={styles.chipText}>
                  {destination.language}
                </Typography>
              </View>
            )}
          </View>

          {/* Price */}
          {destination.cost_of_living && (
            <View style={styles.priceRow}>
              <Typography variant="caption" style={styles.priceLabel}>Avg. Cost of Living</Typography>
              <Typography variant="title" style={styles.priceValue}>
                {destination.cost_of_living}
              </Typography>
            </View>
          )}

          {/* Description */}
          <Typography variant="subtitle" style={styles.sectionTitle}>
            About
          </Typography>
          <Typography variant="body" style={styles.description}>
            {destination.description || 'No description available for this destination.'}
          </Typography>

          {/* Popular for */}
          {destination.popular_for && destination.popular_for.length > 0 && (
            <>
              <Typography variant="subtitle" style={styles.sectionTitle}>
                Popular For
              </Typography>
              <View style={styles.tagsRow}>
                {destination.popular_for.map((tag, i) => (
                  <View key={i} style={styles.tag}>
                    <Typography variant="caption" style={styles.tagText}>
                      {tag}
                    </Typography>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Best time to visit */}
          {destination.best_time_to_visit && (
            <View style={styles.bestTimeRow}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.accent} />
              <View style={styles.bestTimeTextWrap}>
                <Typography variant="caption" style={styles.bestTimeLabel}>Best Time to Visit</Typography>
                <Typography variant="body" style={styles.bestTimeValue}>
                  {destination.best_time_to_visit}
                </Typography>
              </View>
            </View>
          )}

          {/* Extra bottom spacing for FAB clearance */}
          <View style={{ height: 80 }} />
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button — Favourite toggle (springs in) */}
      <Animated.View style={[styles.fab, SHADOWS.button, fabAnimatedStyle]}>
        <TouchableOpacity onPress={() => toggleFavorite(destination)} style={styles.fabInner}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={26}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: 320,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.radiusXl,
    borderTopRightRadius: SIZES.radiusXl,
    marginTop: -28,
    paddingHorizontal: SIZES.lg,
    paddingTop: 28,
    minHeight: 400,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  name: {
    flex: 1,
    marginRight: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: SIZES.radiusFull,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: '#92400E',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  locationText: {
    color: COLORS.secondaryText,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
  },
  chipText: {
    color: COLORS.accent,
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  priceRow: {
    backgroundColor: '#F0FDF4',
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: COLORS.secondaryText,
  },
  priceValue: {
    color: '#16A34A',
    fontFamily: FONTS.bold,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  description: {
    color: COLORS.secondaryText,
    lineHeight: 22,
    marginBottom: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
  },
  tagText: {
    fontFamily: FONTS.medium,
    color: COLORS.primaryText,
    fontSize: 12,
  },
  bestTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 20,
  },
  bestTimeTextWrap: {},
  bestTimeLabel: {
    color: COLORS.secondaryText,
    fontSize: 11,
    marginBottom: 2,
  },
  bestTimeValue: {
    color: COLORS.primaryText,
    fontFamily: FONTS.medium,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    overflow: 'hidden',
  },
  fabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DetailScreen;
