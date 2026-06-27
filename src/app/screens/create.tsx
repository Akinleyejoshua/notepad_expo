import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomNavigation } from "../../context/custom-navigation";
import { HomeHeader } from "@/components/home-header";
import { AppTextArea } from "@/components/app-textareaa";
import { useNoteStore } from "@/store/use-note-store";
import { BottomNav } from "@/components/bottom-nav";

export default function CreateScreen({ route }: { route: any }) {
  const navigation = useCustomNavigation();
  const { noteId } = route.params || {};
  const setTitle = useNoteStore((state) => state.setNoteTitle);
  const setContent = useNoteStore((state) => state.setNoteContent);

  const handleTitleChange = (updatedTitle: string) => {
    setTitle(updatedTitle);
  };

  const handleContentChange = (updatedContent: string) => {
    setContent(updatedContent);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <HomeHeader
          title="Create"
          subtitle="Write something meaningful"
          style={{ marginTop: 12 }}
          hasBackButton={true}
        />

        <View style={styles.editorArea}>
          <AppTextArea
            placeholder="Title"
            style={{ marginTop: 20 }}
            onChange={(val: any) => handleTitleChange(val)}
          />
          <View style={styles.contentCard}>
            <AppTextArea
              placeholder="Start writing..."
              style={{ flex: 1 }}
              inputStyle={{ fontSize: 18 }}
              onChange={(val: any) => handleContentChange(val)}
            />
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navWrapper}>
        <BottomNav activeTab="Create" noteId={null} />
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
