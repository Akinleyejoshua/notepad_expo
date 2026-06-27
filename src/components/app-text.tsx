import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

// Extend default React Native Text props so your component supports all native attributes (numberOfLines, etc.)
interface AppTextProps extends TextProps {
  variant?: 'regular' | 'bold' | 'header' | 'default';
}

export function AppText({ variant = 'regular', style, children, ...props }: AppTextProps) {
  return (
    <RNText 
      style={[styles[variant], style]} 
      {...props}
    >
      {children && children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  regular: {
    fontFamily: 'Bricolage-Regular',
    fontSize: 16,
    color: '#111111',
  },
  bold: {
    fontFamily: 'Bricolage-Bold',
    fontSize: 16,
    color: '#111111',
  },
  header: {
    fontFamily: 'Bricolage-Bold',
    fontSize: 24,
    color: '#111111',
    marginBottom: 8,
  },
  default: {
    fontFamily: 'Bricolage-Regular',
  }
});