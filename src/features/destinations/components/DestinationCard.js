import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFavorites } from '../../favorites/context/FavoritesContext';
import ShimmerLoader from '../../../components/ShimmerLoader';

const M3_COLORS = {
  primary: '#0A56D1',
  surfaceVariant: '#F1F3F4',
  textPrimary: '#1F1F1F',
  white: '#FFFFFF',
  star: '#FFBA28'
};

const DestinationCard = ({ item, onPress }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const liked = isFavorite(item.id);

  const handleImageLoad = () => {
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsLoaded(true);
    });
  };

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.card}
      >
        {!isLoaded && <ShimmerLoader style={StyleSheet.absoluteFill} />}

        <Animated.Image
          source={{ uri: item.image }}
          style={[styles.image, { opacity: imageOpacity }]}
          resizeMode="cover"
          onLoad={handleImageLoad}
        />
        
        {/* Dark gradient overlay for text readability */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />

        {/* Favorite FAB */}
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => toggleFavorite(item)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={22}
            color={liked ? '#B3261E' : M3_COLORS.textPrimary}
          />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <View>
              <Text style={styles.title}>{item.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color={M3_COLORS.white} />
                <Text style={styles.locationText}>{item.country}</Text>
              </View>
            </View>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={14} color={M3_COLORS.star} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  card: {
    height: 320,
    backgroundColor: M3_COLORS.surfaceVariant,
    borderRadius: 28, // Expressive MD3 large rounded corners
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  fab: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: M3_COLORS.white,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: 'GoogleSans-Bold',
    fontSize: 28,
    color: M3_COLORS.white,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.9,
  },
  locationText: {
    fontFamily: 'GoogleSans-Medium',
    fontSize: 15,
    color: M3_COLORS.white,
    marginLeft: 4,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backdropFilter: 'blur(10px)', // web only, but safe to leave
  },
  ratingText: {
    fontFamily: 'GoogleSans-Bold',
    fontSize: 14,
    color: M3_COLORS.white,
    marginLeft: 4,
  },
});

export default DestinationCard;