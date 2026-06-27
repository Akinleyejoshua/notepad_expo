import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StorageService } from '../../services/storage';
import { Note } from '../../types/note';

export default function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Load note detail if editing existing
  useEffect(() => {
    StorageService.getNotes().then((notes) => {
      const existingNote = notes.find((n) => n.id === id);
      if (existingNote) {
        setTitle(existingNote.title);
        setContent(existingNote.content);
      }
    });
  }, [id]);

  // Autosave when exiting the page or typing
  const handleSave = async (updatedTitle: string, updatedContent: string) => {
    if (!updatedTitle.trim() && !updatedContent.trim()) return; // Don't save empty notes
    
    const allNotes = await StorageService.getNotes();
    const cleanNotes = allNotes.filter((n) => n.id !== id);

    const updatedNote: Note = {
      id: id!,
      title: updatedTitle,
      content: updatedContent,
      updatedAt: Date.now(),
    };

    await StorageService.saveNotes([updatedNote, ...cleanNotes]);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.editorWrap}>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            handleSave(text, content);
          }}
        />
        <TextInput
          style={styles.contentInput}
          placeholder="Start writing..."
          placeholderTextColor="#aaa"
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={(text) => {
            setContent(text);
            handleSave(title, text);
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  editorWrap: { flex: 1, padding: 20 },
  titleInput: { fontFamily: 'Inter-Bold', fontSize: 24, color: '#111', marginBottom: 16, padding: 0 },
  contentInput: { fontFamily: 'Inter-Regular', fontSize: 16, color: '#333', flex: 1, padding: 0 },
});