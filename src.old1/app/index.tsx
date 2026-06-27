import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus, FileText } from 'lucide-react-native';
import { Note } from '../types/note';
import { StorageService } from '../services/storage';

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

  // Reload notes every time screen comes back to focus
  useFocusEffect(
    useCallback(() => {
      StorageService.getNotes().then((data) => 
        setNotes(data.sort((a, b) => b.updatedAt - a.updatedAt))
      );
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text>hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontFamily: 'Inter-Regular', color: '#888', marginTop: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  cardTitle: { fontFamily: 'Inter-Bold', fontSize: 16, color: '#111', marginBottom: 4 },
  cardBody: { fontFamily: 'Inter-Regular', fontSize: 14, color: '#666' },
  fab: { position: 'absolute', right: 24, bottom: 24, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
});