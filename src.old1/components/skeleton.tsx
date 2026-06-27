import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Reusable animated shimmer block
function SkeletonBlock({ width: w, height, borderRadius = 8, style }: any) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.12],
  });

  return (
    <Animated.View
      style={[
        {
          width: w,
          height,
          borderRadius,
          backgroundColor: '#C8C8D0',
          opacity,
        },
        style,
      ]}
    />
  );
}

// Single skeleton card matching the redesigned NoteItem shape
export function SkeletonNoteCard({ style }: any) {
  return (
    <View style={[cardStyles.card, style]}>
      {/* Title placeholder */}
      <SkeletonBlock width="65%" height={16} borderRadius={6} />
      {/* Description line 1 */}
      <SkeletonBlock
        width="90%"
        height={12}
        borderRadius={5}
        style={{ marginTop: 14 }}
      />
      {/* Description line 2 */}
      <SkeletonBlock
        width="50%"
        height={12}
        borderRadius={5}
        style={{ marginTop: 8 }}
      />
      {/* Timestamp pill */}
      <View style={cardStyles.metaRow}>
        <SkeletonBlock width={80} height={10} borderRadius={5} />
      </View>
    </View>
  );
}

// List of skeleton cards for the home screen loading state
export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View style={listStyles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonNoteCard key={i} />
      ))}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
  },
});

const listStyles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
});
