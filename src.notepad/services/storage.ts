import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/note';

const NOTES_KEY = '@notepad_notes';

export const StorageService = {
  async getNotes(): Promise<Note[]> {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load notes", e);
      return [];
    }
  },

  async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes", e);
    }
  }
};