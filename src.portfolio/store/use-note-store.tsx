import { create } from "zustand";
import { Note } from "../types/note";
import { StorageService } from "../services/storage";

// 1. Define the blueprint of your Store State and Action modifiers
interface NoteState {
  notes: Note[];
  isLoading: boolean;
  loadNotes: () => Promise<Note[]>;
  addOrUpdateNote: (id: any) => Promise<void>;
  deleteNote: (id: any) => Promise<void>;
  noteTitle: string;
  noteContent: string;
  setNoteTitle: (title: any) => void;
  setNoteContent: (content: any) => void;
  getNoteById: (id:any) => Promise<Note | undefined>;
}

// 2. Create the store hook
export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [
    // {id: 1, title: "Design System Architecture", description: "Build a design system with React Native", updatedAt: Date.now(), content: ""},
    // {id: 2, title: "Design Event Loop", description: "Build a design system with React Native", updatedAt: Date.now(), content: ""},
    // {id: 3, title: "Design Data Structures", description: "Build a design system with React Native", updatedAt: Date.now(), content: ""},
    // {id: 4, title: "Design Algorithms", description: "Build a design system with React Native", updatedAt: Date.now(), content: ""},
  ],
  isLoading: false,
  noteTitle: "",
  noteContent: "",

  setNoteTitle: (title: any) => set({ noteTitle: title }),
  setNoteContent: (content: any) => set({ noteContent: content }),

  // Fetch from storage layer into memory
  loadNotes: async () => {
    set({ isLoading: true });
    const localNotes = await StorageService.getNotes();
    // Sort freshest first
    const sorted = localNotes.sort((a, b) => b.updatedAt - a.updatedAt);
    set({ notes: sorted, isLoading: false });
    return sorted;
  },

  getNoteById: async (id:any) => {
    set({ isLoading: true });

    const notes = await get().loadNotes();
    const note = notes.find((note: Note) => note.id === id);
    set({ isLoading: false });
    console.log(note)

    return note;
  },

  // Save or modify a note
  addOrUpdateNote: async (id: any) => {
    const currentNotes = get().notes;
    // Filter out old version if it exists
    const cleanNotes = currentNotes.filter((note) => note.id !== id);

    const updatedNote: Note = {
      id,
      title: get().noteTitle,
      content: get().noteContent,
      description: get().noteContent.slice(0, 100),
      updatedAt: Date.now(),
    };

    const newNotesList = [updatedNote, ...cleanNotes];

    // Optimistically update global Zustand UI state first
    set({ notes: newNotesList });
    // Write down to persistent device storage
    await StorageService.saveNotes(newNotesList);
  },

  // Remove a note completely
  deleteNote: async (id) => {
    const filteredNotes = get().notes.filter((note) => note.id !== id);
    set({ notes: filteredNotes });
    await StorageService.saveNotes(filteredNotes);
  },
}));
