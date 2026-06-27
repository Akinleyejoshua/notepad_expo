import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomNavigation } from "../../context/custom-navigation";
import { HomeHeader } from "@/components/home-header";
import { AppTextArea } from "@/components/app-textareaa";
import { useNoteStore } from "@/store/use-note-store";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { SkeletonNoteCard } from "@/components/skeleton";

export default function DetailsScreen({ route }: { route: any }) {
  const navigation = useCustomNavigation();
  const { noteId } = route.params || {};

  const [state, setState] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);

  const setTitle = useNoteStore((state) => state.setNoteTitle);
  const setContent = useNoteStore((state) => state.setNoteContent);
  const getNoteById = useNoteStore((state) => state.getNoteById);

  useEffect(() => {
    if (noteId) {
      (async () => {
        const note = await getNoteById(noteId);
        if (note) {
          setState({ title: note.title, content: note.content });
          setTitle(note.title);
          setContent(note.content);
        }
        setLoading(false);
      })();
    } else {
      setLoading(false);
    }
  }, []);

  const handleTitleChange = (updatedTitle: string) => {
    setState((prev) => ({ ...prev, title: updatedTitle }));
    setTitle(updatedTitle);
  };

  const handleContentChange = (updatedContent: string) => {
    setState((prev) => ({ ...prev, content: updatedContent }));
    setContent(updatedContent);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <HomeHeader
          title="Edit"
          subtitle="Refine your thoughts"
          style={{ marginTop: 12 }}
          hasBackButton={true}
        />

        {loading ? (
          <View style={{ marginTop: 24 }}>
            <SkeletonNoteCard />
            <SkeletonNoteCard />
          </View>
        ) : (
          <View style={styles.editorArea}>
            <AppTextArea
              value={state.title}
              placeholder="Title"
              style={{ marginTop: 20 }}
              onChange={(val: any) => handleTitleChange(val)}
            />
            <View style={styles.contentCard}>
              <AppTextArea
                value={state.content}
                placeholder="Continue writing..."
                style={{ flex: 1 }}
                inputStyle={{ fontSize: 18 }}
                onChange={(val: any) => handleContentChange(val)}
              />
            </View>
          </View>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navWrapper}>
        <BottomNav activeTab="Edit" noteId={noteId} />
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
  editorArea: {
    flex: 1,
    marginTop: 4,
  },
  contentCard: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  navWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
});
