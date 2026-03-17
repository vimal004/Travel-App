import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DestinationCard from '../components/DestinationCard';
import { fetchDestinations } from '../services/destinationApi';

const M3_COLORS = {
  background: '#FFFFFF',
  surfaceVariant: '#F1F3F4',
  primary: '#0A56D1',
  onPrimary: '#FFFFFF',
  textPrimary: '#1F1F1F',
  textSecondary: '#444746',
};

const CATEGORIES = ['All', 'Beaches', 'Mountains', 'Culture', 'Cities'];

const FeedScreen = ({ navigation }) => {
  const [destinations, setDestinations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const data = await fetchDestinations();
    setDestinations(data);
    setFilteredData(data);
    
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Filtering
  useEffect(() => {
    let result = destinations;
    if (activeCategory !== 'All') {
      result = result.filter(d => d.category === activeCategory);
    }
    if (searchQuery) {
      result = result.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredData(result);
  }, [activeCategory, searchQuery, destinations]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={M3_COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.title}>Where to next?</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color={M3_COLORS.primary} />
        </View>
      </View>

      {/* M3 Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={22} color={M3_COLORS.textSecondary} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search destinations..."
          placeholderTextColor={M3_COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={M3_COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories / Chips */}
      <View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Feed */}
      <FlatList
        data={filteredData}
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
            tintColor={M3_COLORS.primary}
            colors={[M3_COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="map-outline" size={48} color={M3_COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>No destinations found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filters.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: M3_COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: M3_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontFamily: 'GoogleSans-Medium',
    fontSize: 16,
    color: M3_COLORS.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'GoogleSans-Bold',
    fontSize: 28,
    color: M3_COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: M3_COLORS.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3_COLORS.surfaceVariant,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 28,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'GoogleSans-Regular',
    fontSize: 16,
    color: M3_COLORS.textPrimary,
    marginLeft: 12,
  },
  chipContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: M3_COLORS.background,
    borderWidth: 1,
    borderColor: M3_COLORS.surfaceVariant,
  },
  chipActive: {
    backgroundColor: M3_COLORS.primary,
    borderColor: M3_COLORS.primary,
  },
  chipText: {
    fontFamily: 'GoogleSans-Medium',
    fontSize: 14,
    color: M3_COLORS.textSecondary,
  },
  chipTextActive: {
    color: M3_COLORS.onPrimary,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontFamily: 'GoogleSans-Bold',
    fontSize: 18,
    color: M3_COLORS.textPrimary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: 'GoogleSans-Regular',
    fontSize: 14,
    color: M3_COLORS.textSecondary,
    marginTop: 8,
  }
});

export default FeedScreen;