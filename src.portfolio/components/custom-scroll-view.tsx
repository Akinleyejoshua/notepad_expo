import React, { useState } from 'react';
import { StyleSheet, Animated, View, LayoutChangeEvent } from 'react-native';

interface CustomScrollViewProps {
  children: React.ReactNode;
}

export function CustomScrollView({ children, style }: any) {
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  // Native hardware-accelerated animated value tracking
  const scrollY = React.useRef(new Animated.Value(0)).current;

  // 1. DYNAMIC MEASURING: Calculates exact container frame scale
  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerHeight(e.nativeEvent.layout.height);
  };

  // 2. DYNAMIC MEASURING: Calculates exact height of notes combined
  const onContentLayout = (e: LayoutChangeEvent) => {
    setContentHeight(e.nativeEvent.layout.height);
  };

  // Prevent jumping if content is shorter than the screen window frame
  const scrollEnabled = contentHeight > containerHeight;

  return (
    <View 
      style={[style, styles.viewportContainer]} 
      onLayout={onContainerLayout}
    >
      <Animated.ScrollView
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false} // Clean minimal look, customize as needed!
        
        // 3. SMOOTH DRIVER: Moves scroll calculations straight to native hardware thread
         
        scrollEventThrottle={1} // Tracks updates smoothly down to the millisecond
        
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* The internal wrapper adjusts automatically so no bottom whitespace exists */}
        <View onLayout={onContentLayout} style={styles.contentCanvas}>
          {children} 
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportContainer: {
    flex: 1,
    overflow: 'hidden', // Cleanly clips everything inside your layout container boundaries
  },
  contentCanvas: {
    width: '100%',
  },
});