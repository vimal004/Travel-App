/**
 * DestinationCard.js — A polished card shown in the destination feed.
 * Displays a cover image, title, country, and a favourite heart toggle.
 * Uses subtle shadows, rounded corners, and a press animation.
 */

import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Typography from '../../../components/Typography';
import { COLORS, SIZES, SHADOWS, FONTS } from '../../../config/theme';
import { truncateText } from '../../../utils/helpers';
import { useFavorites } from '../../favorites/context/FavoritesContext';

const DestinationCard = ({ item, onPress }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const liked = isFavorite(item.id);

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const handleHeart = () => {
    // Quick "pop" animation on the heart icon
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    toggleFavorite(item);
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.card, SHADOWS.card]}
      >
        {/* Cover Image */}
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Heart overlay */}
        <Animated.View style={[styles.heartBtn, { transform: [{ scale: heartScale }] }]}>
          <TouchableOpacity onPress={handleHeart} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={22}
              color={liked ? COLORS.heart : COLORS.white}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Info bar */}
        <View style={styles.info}>
          <View style={styles.infoLeft}>
            <Typography variant="subtitle" numberOfLines={1} style={styles.title}>
              {item.name}
            </Typography>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={14} color={COLORS.accent} />
              <Typography variant="caption" style={styles.country}>
                {item.country || 'Unknown'}
              </Typography>
            </View>
          </View>
          {item.rating != null && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color={COLORS.star} />
              <Typography variant="caption" style={styles.ratingText}>
                {Number(item.rating).toFixed(1)}
              </Typography>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SIZES.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: SIZES.radiusFull,
    padding: 8,
  },
  info: {
    paddingHorizontal: SIZES.md,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLeft: {
    flex: 1,
    marginRight: SIZES.sm,
  },
  title: {
    fontSize: 16,
    marginBottom: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  country: {
    fontSize: 12,
    color: COLORS.secondaryText,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: '#92400E',
  },
});

export default DestinationCard;
