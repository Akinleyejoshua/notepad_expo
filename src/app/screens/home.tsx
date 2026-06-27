import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomNavigation } from "../../context/custom-navigation";
import { HomeHeader } from "@/components/home-header";
import { NotebookIcon } from "lucide-react-native";
import { AppText } from "@/components/app-text";
import { NoteItems } from "@/components/note-items";
import { useNoteStore } from "../../store/use-note-store";
import { BottomNav } from "@/components/bottom-nav";
import { CustomScrollView } from "@/components/custom-scroll-view";
import { SkeletonList } from "@/components/skeleton";

function HomeScreen() {
  const navigation = useCustomNavigation();

  // Grab state from the note store
  const notes = useNoteStore((state) => state.notes);
  const isLoading = useNoteStore((state) => state.isLoading);
  const loadNotes = useNoteStore((state) => state.loadNotes);

  // Hydrate state from local storage on mount
  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <HomeHeader
          title="Notepad"
          subtitle="Your notes, beautifully organized"
          style={{ marginTop: 12 }}
        />

        <View style={styles.listArea}>
          {isLoading ? (
            <SkeletonList count={4} />
          ) : notes.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <NotebookIcon size={48} color="#4169E1" />
              </View>
              <AppText
                variant="bold"
                style={{ fontSize: 18, color: "#1A1A2E", marginTop: 20 }}
              >
                No notes yet
              </AppText>
              <AppText
                variant="caption"
                style={{
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 8,
                  lineHeight: 20,
                  paddingHorizontal: 20,
                }}
              >
                Tap Create to start writing your first note
              </AppText>
            </View>
          ) : (
            <CustomScrollView style={{ marginTop: 16, paddingBottom: 20, paddingHorizontal: 10 }}>
              {notes.map((item: any, index: any) => (
                <NoteItems key={item.id} index={index} item={item} />
              ))}
            </CustomScrollView>
          )}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navWrapper}>
        <BottomNav activeTab="Home" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listArea: {
    flex: 1,
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EBF0FB",
    alignItems: "center",
    justifyContent: "center",
  },
  navWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
});

export default HomeScreen;
