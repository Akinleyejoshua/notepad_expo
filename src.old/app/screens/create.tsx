// src/screens/HomeScreen.tsx
import { View, Text, Button, StyleSheet } from "react-native";
import { useCustomNavigation } from "../../context/custom-navigation";
import { HomeHeader } from "@/components/home-header";
import { AppText } from "@/components/app-text";
import { CreateNavBar } from "@/components/create-navbar";
import { AppTextArea } from "@/components/app-textareaa";
import { useNoteStore } from "@/store/use-note-store";

// src/screens/DetailsScreen.tsx
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
    <View style={styles.home}>
      <HomeHeader
        title="Creator"
        style={{ marginTop: 60 }}
        hasBackButton={true}
      />
      <View style={{ height: 760 }}>
        <AppTextArea
          placeholder="Title"
          style={{ marginTop: 20 }}
          onChange={(val: any) => handleTitleChange(val)}
        />
        <AppTextArea
          placeholder="Content"
          style={{
            height: 600,
            marginTop: 0,
            padding: 20,
            borderRadius: 20,
            backgroundColor: "#f4f4f4c7",
          }}
          inputStyle={{ fontSize: 20 }}
          onChange={(val: any) => handleContentChange(val)}
        />
      </View>
      <View
        style={{
          backgroundColor: "#d2d2d20a",
          borderRadius: 50,
          padding: 1,
        }}
      >
        <CreateNavBar tabName={"Create"} tabActive={true} noteId={null} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
     // Allows home container to span the entire screen height
    paddingHorizontal: 20,
    backgroundColor: "#ffffffff", // Ensures clean backdrop match
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    maxHeight: 700,
    width: "100%",
  },
  itemsContainer: {
    paddingVertical: 20,
    gap: 12, // Cleans up separation spaces uniformly
  },
});
