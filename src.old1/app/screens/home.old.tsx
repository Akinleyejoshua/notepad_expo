// src/screens/HomeScreen.tsx
import { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useCustomNavigation } from "../../context/custom-navigation";
import { HomeHeader } from "@/components/home-header";
import { AppInput } from "@/components/input";
import { SearchIcon } from "lucide-react-native";
import { AppText } from "@/components/app-text";
import { NoteItems } from "@/components/note-items";
import { useNoteStore } from "../../store/use-note-store";
import { HomeNavBar } from "@/components/home-navbar";

function HomeScreen() {
  const navigation = useCustomNavigation();

  // 1. Grab both the notes array and the store's load mechanism
  const notes = useNoteStore((state) => state.notes);
  const loadNotes = useNoteStore((state) => state.loadNotes);

  // 2. Hydrate state from local storage explicitly when screen mounts
  useEffect(() => {
    // loadNotes();
  }, []);

  return (
    // Changed outer view wrapper to flex: 1 so it fills up the viewport safely
    <View style={styles.home}>
      <HomeHeader title="Notepad" style={{ marginTop: 90 }} />

      <View style={{ marginVertical: 30 }}>
        <AppInput
          icon={<SearchIcon size={24} color="#0059ffb7" />}
          placeholder="Search notes"
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <AppText style={{ fontSize: 30 }} variant="default">
          Recent Notes
        </AppText>
      </View>

      {/* 3. Changed from a View to a ScrollView for native scrolling performance */}
      <ScrollView
        contentContainerStyle={styles.itemsContainer}
        showsVerticalScrollIndicator={false}
        style={{
          marginBottom: 1,
          marginVertical: 30,
          paddingLeft: 1,
          paddingRight: 1,
          paddingTop: 0,
        }}
      >
        {notes.map((item: any, index: any) => {
          return (
            // Use a unique ID string for keys instead of array index for stable rendering lists
            <NoteItems key={item.id} index={index} item={item} />
          );
        })}
      </ScrollView>

      <View
        style={{
          backgroundColor: "#d2d2d207",
          borderRadius: 50,
          padding: 1,
          marginBottom: 60,
        }}
      >
        <HomeNavBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1, // Allows home container to span the entire screen height
    paddingHorizontal: 20,
    backgroundColor: "#fff", // Ensures clean backdrop match
  },
  itemsContainer: {
    paddingVertical: 20,
    gap: 12, // Cleans up separation spaces uniformly
  },
});

export default HomeScreen;
