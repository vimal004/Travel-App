/**
 * FeedScreen.js — The main destinations feed.
 * Fetches destinations from the API, shows loading/error states,
 * supports pull-to-refresh, and renders a FlatList of DestinationCards.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../../components/ScreenWrapper';
import Typography from '../../../components/Typography';
import DestinationCard from '../components/DestinationCard';
import { fetchDestinations } from '../services/destinationApi';
import { COLORS, SIZES, FONTS } from '../../../config/theme';

const FeedScreen = ({ navigation }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch data from the API ──
  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const data = await fetchDestinations();
      setDestinations(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Loading state ──
  if (loading && !refreshing) {
    return (
      <ScreenWrapper>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Typography variant="caption" style={styles.loadingText}>
            Loading destinations…
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={56} color={COLORS.secondaryText} />
          <Typography variant="subtitle" style={styles.errorTitle}>
            Oops, something went wrong
          </Typography>
          <Typography variant="caption" style={styles.errorMsg}>
            {error}
          </Typography>
          <TouchableOpacity style={styles.retryBtn} onPress={() => loadData()}>
            <Ionicons name="refresh" size={18} color={COLORS.white} />
            <Typography variant="button" style={styles.retryTxt}>
              Retry
            </Typography>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  // ── List ──
  return (
    <ScreenWrapper>
      {/* Screen header */}
      <View style={styles.header}>
        <View>
          <Typography variant="caption" style={styles.greeting}>
            Explore
          </Typography>
          <Typography variant="heading">Destinations</Typography>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="search-outline" size={22} color={COLORS.primaryText} />
        </View>
      </View>

      <FlatList
        data={destinations}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <DestinationCard
            item={item}
            onPress={() => navigation.navigate('Detail', { destination: item })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 18,
  },
  greeting: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: COLORS.accent,
    fontFamily: FONTS.medium,
    marginBottom: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  list: {
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
  },
  errorTitle: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorMsg: {
    marginTop: 6,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radiusFull,
  },
  retryTxt: {
    fontSize: 14,
  },
});

export default FeedScreen;
