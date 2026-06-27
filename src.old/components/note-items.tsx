import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AppText } from "./app-text";
import { Edit2, TimerIcon } from "lucide-react-native";
import { AppButton } from "./button";
import { TrashIcon } from "lucide-react-native";
import { useCustomNavigation } from "@/context/custom-navigation";
import { useNoteStore } from "@/store/use-note-store";
import { dialog } from '@/store/use-modal-store';

export function NoteItems({ item, index, style, key }: any) {
  const navigation = useCustomNavigation();
  const deleteNote = useNoteStore((state) => state.deleteNote);

  const handleDelete = async () => {
    const userConfirmed = await dialog.confirm(
      'Delete Note?', 
      'This action cannot be undone. Do you wish to proceed?'
    );

    if (userConfirmed) {
      deleteNote(item.id);
    }
  };
  
  return (
    <TouchableOpacity onPress={() => navigation.push("Details", { noteId: item.id })}>
      <View key={index} style={[styles.container, style]}>
        <AppText style={{ fontSize: 26, fontWeight: "600" }}>
          {item.title}
        </AppText>
        <AppText style={{ color: "#000000ff", fontSize: 18, opacity: 0.5 }}>
          {item.description}
        </AppText>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "#ffffffff",
            padding: 10,
            borderRadius: 20,
          }}
        >
          <TimerIcon size={20} color="#2563eb" />
          <AppText style={{ color: "royalblue" }}>
            {new Date(item.updatedAt).toLocaleTimeString()}
          </AppText>
        </View>

        <View
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <AppButton
          onPress={handleDelete}
            style={{
              backgroundColor: "#d94d4dcc",
              width: 10,
              borderRadius: 50,
              padding: 10,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={<TrashIcon size={15} color="white" />}
          />

          <AppButton
          onPress={() => navigation.push("Details", { noteId: item.id })}
            style={{
              backgroundColor: "#4d85d9d1",
              width: 10,
              borderRadius: 50,
              padding: 10,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={<Edit2 size={15} color="white" />}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    padding: 30,
    borderRadius: 30,
    backgroundColor: "#e9e9e947",
    borderLeftWidth: 1,
    borderLeftColor: "#53a0f7ba",
    position: "relative",
  },
});
