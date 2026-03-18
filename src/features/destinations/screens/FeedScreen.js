import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DestinationCard from '../components/DestinationCard';
import { fetchDestinations } from '../services/destinationApi';
import { useTheme } from '../../../config/ThemeContext';

const CATEGORIES = ['All', 'Beaches', 'Mountains', 'Culture', 'Cities'];

const FeedScreen = ({ navigation }) => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const [destinations, setDestinations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Profile specific state
  const [userProfile, setUserProfile] = useState({ name: '', email: '', avatar: null });
  const [isProfileMenuVisible, setProfileMenuVisible] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  };

  const greeting = getGreeting();

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

  // Fetch logged-in user details
  const fetchUserProfile = useCallback(async () => {
    try {
      const email = await AsyncStorage.getItem('currentUser');
      if (email) {
        // Get basic name/email
        let name = 'Traveler';
        const usersStr = await AsyncStorage.getItem('users_db');
        if (usersStr) {
          const users = JSON.parse(usersStr);
          if (users[email]) {
            name = users[email].name;
          }
        }

        // Get extended profile (avatar, etc)
        let avatar = null;
        const profileStr = await AsyncStorage.getItem(`profile_${email}`);
        if (profileStr) {
          const savedProfile = JSON.parse(profileStr);
          avatar = savedProfile.avatar;
          if (savedProfile.name) name = savedProfile.name;
        }

        setUserProfile({ name, email, avatar });
      }
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

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

  const handleLogout = async () => {
    setProfileMenuVisible(false);
    try {
      // Clear session data
      await AsyncStorage.removeItem('session');
      await AsyncStorage.removeItem('currentUser');
      // Navigate to Auth flow
      navigation.replace('Welcome');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}{userProfile.name ? `, ${userProfile.name.split(' ')[0]}` : ','}</Text>
          <Text style={styles.title}>Where to next?</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.avatar, { marginRight: 12 }]} 
            onPress={toggleTheme}
          >
            <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.avatar} 
            onPress={() => setProfileMenuVisible(true)}
          >
            {userProfile.avatar ? (
              <Image source={{ uri: userProfile.avatar }} style={styles.avatarIconImage} />
            ) : (
              <Ionicons name="person" size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Dropdown Menu */}
      <Modal
        visible={isProfileMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setProfileMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={() => setProfileMenuVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.profileMenu}>
              <View style={styles.menuHeader}>
                {userProfile.avatar ? (
                  <Image source={{ uri: userProfile.avatar }} style={styles.menuAvatar} />
                ) : (
                  <View style={styles.menuAvatarPlaceholder}>
                    <Ionicons name="person" size={24} color={colors.primary} />
                  </View>
                )}
                <View style={styles.menuHeaderText}>
                  <Text style={styles.profileName} numberOfLines={1}>{userProfile.name || 'User'}</Text>
                  <Text style={styles.profileEmail} numberOfLines={1}>{userProfile.email}</Text>
                </View>
              </View>
              <View style={styles.menuDivider} />
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => {
                  setProfileMenuVisible(false);
                  navigation.navigate('Profile');
                }}
              >
                <Ionicons name="person-outline" size={20} color={colors.primary} />
                <Text style={styles.menuItemText}>View Profile</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color={colors.error} />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

      {/* M3 Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={22} color={colors.secondaryText} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search destinations..."
          placeholderTextColor={colors.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.secondaryText} />
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
        contentContainerStyle={[
          styles.list,
          { paddingBottom: 40 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="map-outline" size={48} color={colors.secondaryText} />
            <Text style={styles.emptyTitle}>No destinations found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filters.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const createStyles = (colors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
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
    zIndex: 1, // Ensure header is above search
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontFamily: 'GoogleSans-Medium',
    fontSize: 16,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'GoogleSans-Bold',
    fontSize: 28,
    color: colors.primaryText,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarIconImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // subtle dimming
  },
  profileMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 70, // Adjust drop-down location
    right: 24,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    minWidth: 220,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  menuAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  menuAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuHeaderText: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'GoogleSans-Bold',
    fontSize: 18,
    color: colors.primaryText,
  },
  profileEmail: {
    fontFamily: 'GoogleSans-Regular',
    fontSize: 14,
    color: colors.secondaryText,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.surfaceVariant,
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  menuItemText: {
    fontFamily: 'GoogleSans-Medium',
    fontSize: 16,
    color: colors.primaryText,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  logoutText: {
    fontFamily: 'GoogleSans-Medium',
    fontSize: 16,
    color: colors.error,
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
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
    color: colors.primaryText,
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontFamily: 'GoogleSans-Medium',
    fontSize: 14,
    color: colors.secondaryText,
  },
  chipTextActive: {
    color: colors.onPrimary,
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
    color: colors.primaryText,
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: 'GoogleSans-Regular',
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 8,
  }
});

export default FeedScreen;