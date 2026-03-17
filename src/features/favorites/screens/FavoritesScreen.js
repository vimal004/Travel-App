/**
 * FavoritesScreen.js — Displays the user's saved favourite destinations.
 * Shows a beautiful illustrated empty state when the list is empty,
 * and tappable cards that navigate to the detail view.
 */

import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../../components/ScreenWrapper';
import Typography from '../../../components/Typography';
import { useFavorites } from '../context/FavoritesContext';
import { SIZES, SHADOWS, FONTS } from '../../../config/theme';
import { useTheme } from '../../../config/ThemeContext';

const FavoritesScreen = ({ navigation }) => {
  const { favorites, removeFavorite } = useFavorites();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // ── Beautiful empty state ──
  if (favorites.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <Typography variant="heading">Favorites</Typography>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="heart-outline" size={56} color={colors.accent} />
          </View>
          <Typography variant="title" style={styles.emptyTitle}>
            No favorites yet
          </Typography>
          <Typography variant="body" style={styles.emptySubtitle}>
            Tap the heart icon on any destination to save it here for later.
          </Typography>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('Explore')}
          >
            <Typography variant="button" style={styles.exploreBtnText}>
              Explore Destinations
            </Typography>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  // ── Favorite card renderer ──
  const renderFavorite = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.card, SHADOWS.card]}
      onPress={() => navigation.navigate('Detail', { destination: item })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardInfo}>
        <View style={styles.cardTextWrap}>
          <Typography variant="subtitle" numberOfLines={1}>
            {item.name}
          </Typography>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={13} color={colors.accent} />
            <Typography variant="caption" style={styles.locationText}>
              {item.country || 'Unknown'}
            </Typography>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => removeFavorite(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="heart-dislike-outline" size={20} color={colors.heart} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Typography variant="heading">Favorites</Typography>
        <Typography variant="caption" style={styles.countBadge}>
          {favorites.length} {favorites.length === 1 ? 'place' : 'places'}
        </Typography>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderFavorite}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

const createStyles = (colors) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 18,
  },
  countBadge: {
    backgroundColor: colors.surfaceVariant || '#EFF6FF',
    color: colors.accent,
    fontFamily: FONTS.medium,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
    fontSize: 12,
  },
  list: {
    paddingBottom: 24,
  },
  // ── Card ──
  card: {
    backgroundColor: colors.surface,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    marginBottom: SIZES.md,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: 14,
  },
  cardTextWrap: {
    flex: 1,
    marginRight: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  locationText: {
    color: colors.secondaryText,
    fontSize: 12,
  },
  removeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceVariant || '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ── Empty state ──
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 60,
  },
  emptyIconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.surfaceVariant || '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: colors.primaryText,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: colors.secondaryText,
    lineHeight: 22,
    marginBottom: 28,
  },
  exploreBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: SIZES.radiusFull,
  },
  exploreBtnText: {
    fontSize: 14,
    color: colors.white,
  },
});

export default FavoritesScreen;
