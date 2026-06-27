// src/screens/HomeScreen.tsx
import { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useCustomNavigation } from "../../context/custom-navigation";
import { HomeHeader } from "@/components/home-header";
import { AppInput } from "@/components/input";
import { NotebookIcon, PlusIcon, SearchIcon } from "lucide-react-native";
import { AppText } from "@/components/app-text";
import { NoteItems } from "@/components/note-items";
import { useNoteStore } from "../../store/use-note-store";
import { HomeNavBar } from "@/components/home-navbar";
import { CustomScrollView } from "@/components/custom-scroll-view";
import { AppButton } from "@/components/button";

function HomeScreen() {
  const navigation = useCustomNavigation();
  const tabName = "Home";
  const tabActive = true;

  // 1. Grab both the notes array and the store's load mechanism
  const notes = useNoteStore((state) => state.notes);
  const loadNotes = useNoteStore((state) => state.loadNotes);

  // 2. Hydrate state from local storage explicitly when screen mounts
  useEffect(() => {
    loadNotes();
  }, []);

  return (
    // Changed outer view wrapper to flex: 1 so it fills up the viewport safely
    <View style={styles.home}>
      <HomeHeader title="Notepad" style={{ marginTop: 60 }} />
      {/* 3. Changed from a View to a ScrollView for native scrolling performance */}

      <View style={{ height: 760 }}>
        {notes.length == 0 ? (
          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <NotebookIcon
              size={100}
              color="#535ef6b1"
              style={{ marginBottom: 20 }}
            />
            <AppText
              variant="default"
              style={{ fontSize: 20, color: "#000000b1" }}
            >
              No notes found, Click Create to document a data
            </AppText>
          </View>
        ) : (
          <CustomScrollView style={{ marginTop: 20, paddingBottom: 20 }}>
            {notes.map((item: any, index: any) => {
              return (
                // Use a unique ID string for keys instead of array index for stable rendering lists
                <NoteItems key={item.id} index={index} item={item} />
              );
            })}
          </CustomScrollView>
        )}
      </View>

      <View
        style={{
          backgroundColor: "#d2d2d207",
          borderRadius: 50,
          padding: 1,
          marginBottom: 60,
        }}
      >
        <HomeNavBar tabName={tabName} tabActive={tabActive} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1, // Allows home container to span the entire screen height
    paddingHorizontal: 20,
    backgroundColor: "#fff", // Ensures clean backdrop match
    flexDirection: "column",
    justifyContent: "space-between",
    maxHeight: 700,
  },
  itemsContainer: {
    paddingVertical: 20,
    gap: 12, // Cleans up separation spaces uniformly
  },
});

export default HomeScreen;
