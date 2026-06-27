import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions, Pressable } from 'react-native';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react-native';
import { AppText } from './app-text';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  type: ToastType;
  message: string;
  description?: string;
  onClose: () => void;
  duration?: number;
}

// Map configuration metadata for premium design tokens
const TOAST_CONFIG = {
  success: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    icon: <CheckCircle2 size={22} color="#10B981" />,
    title: 'Success',
  },
  error: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    icon: <XCircle size={22} color="#EF4444" />,
    title: 'Error',
  },
  warning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    icon: <AlertCircle size={22} color="#F59E0B" />,
    title: 'Warning',
  },
  info: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    icon: <Info size={22} color="#3B82F6" />,
    title: 'Info',
  },
};

export function Toast({ visible, type, message, description, onClose, duration = 4000 }: ToastProps) {
  // Animation driver configurations
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // 1. Entry slide & spring animation
      Animated.spring(animatedValue, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }).start();

      // 2. Auto-dismiss countdown pipeline
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      animatedValue.setValue(0);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  if (!visible) return null;

  const config = TOAST_CONFIG[type];

  // Interpolate slide coordinates safely starting from above the viewport display frame
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0], 
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.7, 1],
  });

  return (
    <Animated.View 
      style={[
        styles.toastAnchor, 
        { transform: [{ translateY }], opacity }
      ]}
    >
      <View style={[styles.toastCard, { backgroundColor: config.backgroundColor, borderColor: config.borderColor }]}>
        {/* Left Side: Dynamic Notification Icon Context */}
        <View style={styles.iconContainer}>{config.icon}</View>

        {/* Center: Message Strings Mapping */}
        <View style={styles.textContainer}>
          <AppText variant="bold" style={styles.titleText}>{config.title}</AppText>
          <AppText style={styles.messageText}>{message}</AppText>
          {description && <AppText style={styles.descText}>{description}</AppText>}
        </View>

        {/* Right Side: Manual Exit Dismiss Trigger Button */}
        <Pressable onPress={handleDismiss} style={styles.closeButton}>
          <X size={16} color="#6B7280" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  toastAnchor: {
    position: 'absolute',
    top: 60, // Sits cleanly under standard hardware status notch bars
    left: 0,
    right: 0,
    zIndex: 9999, // Guarantees layout floats on top of text areas and lists
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  toastCard: {
    width: width - 32,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    
    // Premium capsule drop depth shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  titleText: {
    fontSize: 15,
    color: '#1F2937',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 18,
  },
  descText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: 2,
  },
});