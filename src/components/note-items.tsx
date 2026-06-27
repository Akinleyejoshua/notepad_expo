import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AppText } from "./app-text";
import { Edit2, Trash2, Clock } from "lucide-react-native";
import { useCustomNavigation } from "@/context/custom-navigation";
import { useNoteStore } from "@/store/use-note-store";
import { dialog } from "@/store/use-modal-store";
import { AppButton } from "./button";

export function NoteItems({ item, index, style }: any) {
  const navigation = useCustomNavigation();
  const deleteNote = useNoteStore((state) => state.deleteNote);

  const handleDelete = async () => {
    const userConfirmed = await dialog.confirm(
      "Delete Note?",
      "This action cannot be undone. Do you wish to proceed?"
    );
    if (userConfirmed) {
      deleteNote(item.id);
    }
  };

  // Format relative time
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.push("Details", { noteId: item.id })}
      activeOpacity={0.8}
    >
      <View style={[styles.card, style]}>
        {/* Timestamp badge — top right */}
        <View style={styles.timeBadge}>
          <Clock size={11} color="#8E8E9A" />
          <AppText variant="caption" style={styles.timeText}>
            {formatTime(item.updatedAt)}
          </AppText>
        </View>

        {/* Title */}
        <AppText
          variant="bold"
          numberOfLines={1}
          style={styles.title}
        >
          {item.title}
        </AppText>

        {/* Description */}
        <AppText
          numberOfLines={2}
          style={styles.description}
        >
          {item.description}
        </AppText>

        {/* Action buttons — bottom right */}
        <View style={styles.actions}>
          <AppButton
            onPress={handleDelete}
            style={[styles.actionBtn, styles.deleteBtn]}
            activeOpacity={0.7}
            icon={<Trash2 size={14} color="#FF6B6B" />}
          />

          {/* <AppButton
            onPress={() => navigation.push("Details", { noteId: item.id })}
            style={[styles.actionBtn, styles.editBtn]}
            activeOpacity={0.7}
            icon={<Edit2 size={14} color="#4169E1" />}
          /> */}
          
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f0f0f0ff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    position: "relative",
    // Premium card shadow
    // shadowColor: "#1A1A2E",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 10,
    // elevation: 3,
  },
  timeBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8F8FC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 11,
    color: "#8E8E9A",
  },
  title: {
    fontSize: 18,
    color: "#1A1A2E",
    marginBottom: 6,
    paddingRight: 80, // avoid overlap with time badge
  },
  description: {
    fontSize: 14,
    color: "#8E8E9A",
    lineHeight: 20,
    paddingRight: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: "#FFF0F0",
  },
  editBtn: {
    backgroundColor: "#EBF0FB",
  },
});
