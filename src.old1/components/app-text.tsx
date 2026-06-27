import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

// Extend default React Native Text props so your component supports all native attributes (numberOfLines, etc.)
interface AppTextProps extends TextProps {
  variant?: 'regular' | 'bold' | 'header' | 'default' | 'caption';
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
    color: '#1A1A2E',
  },
  bold: {
    fontFamily: 'Bricolage-Bold',
    fontSize: 16,
    color: '#1A1A2E',
  },
  header: {
    fontFamily: 'Bricolage-Bold',
    fontSize: 24,
    color: '#1A1A2E',
    marginBottom: 8,
  },
  default: {
    fontFamily: 'Bricolage-Regular',
  },
  caption: {
    fontFamily: 'Bricolage-Regular',
    fontSize: 12,
    color: '#8E8E9A',
  },
});