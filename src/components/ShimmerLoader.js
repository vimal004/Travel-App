import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ShimmerLoader = ({ style }) => {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const translateAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );
    
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 600,
          useNativeDriver: true,
        })
      ])
    );

    translateAnimation.start();
    pulseAnimation.start();
    
    return () => {
      translateAnimation.stop();
      pulseAnimation.stop();
    };
  }, [shimmerAnim, pulseAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: pulseAnim,
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.7)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E6EAEF', // Soft premium base color
    overflow: 'hidden',
  },
});

export default ShimmerLoader;
