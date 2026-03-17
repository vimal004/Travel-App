import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withDelay, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../favorites/context/FavoritesContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const M3_COLORS = {
  background: '#FFFFFF',
  surfaceVariant: '#F1F3F4',
  primary: '#0A56D1',
  primaryContainer: '#D3E3FD',
  textPrimary: '#1F1F1F',
  textSecondary: '#444746',
  white: '#FFFFFF',
};

// Reusable component for the data grid to keep code clean
const QuickFact = ({ icon, title, value }) => (
  <View style={styles.quickFactContainer}>
    <View style={styles.iconBox}>
      <Ionicons name={icon} size={20} color={M3_COLORS.primary} />
    </View>
    <View style={styles.quickFactText}>
      <Text style={styles.quickFactTitle}>{title}</Text>
      <Text style={styles.quickFactValue} numberOfLines={1}>{value}</Text>
    </View>
  </View>
);

const DetailScreen = ({ route, navigation }) => {
  const { destination } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(destination.id);

  const heroScale = useSharedValue(1.1);
  const infoTranslateY = useSharedValue(60);
  const fabScale = useSharedValue(0);

  React.useEffect(() => {
    heroScale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    infoTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
    fabScale.value = withDelay(400, withSpring(1, { damping: 12, stiffness: 150 }));
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroContainer}>
          <Animated.Image 
            source={{ uri: destination.image }} 
            style={[styles.heroImage, { transform: [{ scale: heroScale }] }]} 
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={M3_COLORS.white} />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.infoCard, { transform: [{ translateY: infoTranslateY }] }]}>
          <View style={styles.dragHandle} />
          
          <Text style={styles.title}>{destination.name}</Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={16} color={M3_COLORS.primary} />
            <Text style={styles.locationText}>{destination.country}</Text>
          </View>

          <View style={styles.chipRow}>
             <View style={styles.ratingChip}>
                <Ionicons name="star" size={14} color="#F5B400" />
                <Text style={styles.ratingText}>{destination.rating}</Text>
             </View>
             {/* Using climate as the secondary chip to replace the missing 'category' */}
             <View style={styles.chip}>
                <Text style={styles.chipText}>{destination.climate}</Text>
             </View>
          </View>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>
            {destination.description}
          </Text>

          {/* New Quick Facts Grid */}
          <View style={styles.gridContainer}>
            <QuickFact icon="cash-outline" title="Cost" value={destination.cost_of_living} />
            <QuickFact icon="language-outline" title="Language" value={destination.language} />
            <QuickFact icon="partly-sunny-outline" title="Climate" value={destination.climate} />
            <QuickFact icon="wallet-outline" title="Currency" value={destination.currency} />
          </View>

          {/* Best Time to Visit Highlight Card */}
          <View style={styles.highlightCard}>
            <Ionicons name="calendar-outline" size={24} color={M3_COLORS.primary} style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.highlightTitle}>Best Time to Visit</Text>
              <Text style={styles.highlightText}>{destination.best_time_to_visit}</Text>
            </View>
          </View>

          {/* Popular For Tags */}
          <Text style={styles.sectionTitle}>Popular For</Text>
          <View style={styles.tagsContainer}>
            {destination.popular_for.map((item, index) => (
              <View key={index} style={styles.tagPill}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Bottom padding so content doesn't get hidden behind the FAB */}
          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>

      <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity onPress={() => toggleFavorite(destination)} style={styles.fabInner}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={28} color={M3_COLORS.white} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: M3_COLORS.background },
  heroContainer: { width: SCREEN_WIDTH, height: 400, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  backBtn: { position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  infoCard: { backgroundColor: M3_COLORS.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -40, paddingHorizontal: 24, paddingTop: 16, minHeight: 500 },
  dragHandle: { width: 40, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: 24 },
  title: { fontFamily: 'GoogleSans-Bold', fontSize: 32, color: M3_COLORS.textPrimary, marginBottom: 8, letterSpacing: -0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  locationText: { fontFamily: 'GoogleSans-Medium', fontSize: 16, color: M3_COLORS.textSecondary, marginLeft: 6 },
  
  chipRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  chip: { backgroundColor: M3_COLORS.surfaceVariant, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100 },
  chipText: { fontFamily: 'GoogleSans-Medium', fontSize: 14, color: M3_COLORS.textPrimary },
  ratingChip: { backgroundColor: M3_COLORS.primaryContainer, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100, flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingText: { fontFamily: 'GoogleSans-Bold', fontSize: 14, color: M3_COLORS.primary },
  
  sectionTitle: { fontFamily: 'GoogleSans-Bold', fontSize: 20, color: M3_COLORS.textPrimary, marginBottom: 12, marginTop: 8 },
  description: { fontFamily: 'GoogleSans-Regular', fontSize: 16, color: M3_COLORS.textSecondary, lineHeight: 26, marginBottom: 24 },
  
  // Grid Styles
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  quickFactContainer: { width: '48%', flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: M3_COLORS.surfaceVariant, padding: 12, borderRadius: 16 },
  iconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: M3_COLORS.white, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  quickFactText: { flex: 1 },
  quickFactTitle: { fontFamily: 'GoogleSans-Medium', fontSize: 12, color: M3_COLORS.textSecondary, marginBottom: 2 },
  quickFactValue: { fontFamily: 'GoogleSans-Bold', fontSize: 14, color: M3_COLORS.textPrimary },

  // Highlight Card
  highlightCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: M3_COLORS.primaryContainer, padding: 16, borderRadius: 16, marginBottom: 32 },
  highlightTitle: { fontFamily: 'GoogleSans-Medium', fontSize: 13, color: M3_COLORS.primary, marginBottom: 2 },
  highlightText: { fontFamily: 'GoogleSans-Bold', fontSize: 15, color: M3_COLORS.textPrimary },

  // Tags
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagPill: { borderWidth: 1, borderColor: '#E0E0E0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100 },
  tagText: { fontFamily: 'GoogleSans-Medium', fontSize: 14, color: M3_COLORS.textSecondary },

  fab: { position: 'absolute', bottom: 32, right: 24, width: 64, height: 64, borderRadius: 16, backgroundColor: M3_COLORS.primary, elevation: 6 },
  fabInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default DetailScreen;