import React from 'react';
import { Modal, StyleSheet, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useModalStore } from '../store/use-modal-store';
import { AppText } from './app-text';

export function GlobalModal() {
  const { 
    visible, type, title, message, placeholder, inputValue, 
    confirmText, cancelText, onConfirm, onCancel, setInputValue 
  } = useModalStore();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          
          {/* Header & Description Elements */}
          <AppText variant="bold" style={styles.title}>{title}</AppText>
          <AppText style={styles.message}>{message}</AppText>

          {/* Conditional Prompt Input Area */}
          {type === 'prompt' && (
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              value={inputValue}
              onChangeText={setInputValue}
              autoFocus
              placeholderTextColor="#9ca3af"
            />
          )}

          {/* Action Row Configurations */}
          <View style={styles.actionRow}>
            {type !== 'alert' && (
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onCancel}>
                <AppText variant="bold" style={styles.cancelTxt}>{cancelText}</AppText>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.btn, styles.confirmBtn]} 
              onPress={() => onConfirm(inputValue)}
            >
              <AppText variant="bold" style={styles.confirmTxt}>{confirmText}</AppText>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent clean modal backdrop
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  alertBox: {
    width: Math.min(width - 48, 340),
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  title: {
    fontSize: 19,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#f3f4f6',
  },
  confirmBtn: {
    backgroundColor: '#007AFF', // Solid premium branding action block
  },
  cancelTxt: {
    color: '#4b5563',
    fontSize: 15,
  },
  confirmTxt: {
    color: '#ffffff',
    fontSize: 15,
  },
});