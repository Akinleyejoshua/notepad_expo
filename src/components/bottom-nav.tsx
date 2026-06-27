import { useCustomNavigation } from "@/context/custom-navigation";
import { useNoteStore } from "@/store/use-note-store";
import { toast } from "@/store/use-toast-store";
import { Home, PlusCircleIcon, SaveIcon, Search } from "lucide-react-native";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "./app-text";

const { width } = Dimensions.get("window");

interface BottomNavProps {
  /** Current screen context — determines which tab is active and center button behavior */
  activeTab: "Home" | "Create" | "Edit" | "Search";
  /** Pass the noteId when on Edit screen so save/update can use it */
  noteId?: string | null;
}

export function BottomNav({ activeTab, noteId }: BottomNavProps) {
  const navigation = useCustomNavigation();
  const addOrUpdateNote = useNoteStore((state) => state.addOrUpdateNote);

  const generateId = () => {
    return "xxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const isActionScreen = ["Create", "Edit"].includes(activeTab);

  const handleCenterPress = () => {
    if (isActionScreen) {
      // Save or Update
      const id = noteId || generateId();
      addOrUpdateNote(id);
      navigation.push("Home");
      toast.show(
        "success",
        activeTab === "Edit" ? "Note updated" : "Note saved",
      );
    } else {
      navigation.push("Create");
    }
  };

  const centerLabel = isActionScreen
    ? activeTab === "Edit"
      ? "Update"
      : "Save"
    : "Create";

  return (
    <View style={styles.wrapper}>
      {/* ── Bar background ── */}
      <View style={styles.bar}>
        {/* Left — Home */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.push("Home")}
          activeOpacity={0.7}
        >
          <Home
            size={22}
            color={activeTab === "Home" ? "#4169E1" : "#AEAEB2"}
          />
          <AppText
            style={[
              styles.tabLabel,
              activeTab === "Home" && styles.tabLabelActive,
            ]}
          >
            Home
          </AppText>
          {activeTab === "Home" && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* Spacer for center button */}
        <View style={styles.centerSpacer} />

        {/* Right — Search */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.push("Search")}
          activeOpacity={0.7}
        >
          <Search
            size={22}
            color={activeTab === "Search" ? "#4169E1" : "#AEAEB2"}
          />
          <AppText
            style={[
              styles.tabLabel,
              activeTab === "Search" && styles.tabLabelActive,
            ]}
          >
            Search
          </AppText>
          {activeTab === "Search" && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>

      {/* ── Elevated center button ── */}
      <TouchableOpacity
        style={[
          styles.centerButton,
          isActionScreen && styles.centerButtonAction,
        ]}
        onPress={handleCenterPress}
        activeOpacity={0.85}
      >
        <View style={styles.centerButtonInner}>
          {isActionScreen ? (
            <SaveIcon size={24} color="#FFFFFF" />
          ) : (
            <PlusCircleIcon size={24} color="#FFFFFF" />
          )}
        </View>
        <AppText variant="bold" style={styles.centerLabel}>
          {centerLabel}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignItems: "center",
    paddingBottom: 8,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: width - 40,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 20,
    position: "relative",
  },
  tabLabel: {
    fontSize: 13,
    color: "#8E8E9A",
    marginTop: 4,
    fontFamily: "Bricolage-Bold",
  },
  tabLabelActive: {
    color: "#4169E1",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4169E1",
    marginTop: 4,
  },
  centerSpacer: {
    width: 80,
  },
  // ── Elevated center button ──
  centerButton: {
    position: "absolute",
    top: -28,
    alignItems: "center",
    zIndex: 20,
  },
  centerButtonAction: {
    // No visual change needed — the inner already uses accent
  },
  centerButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4169E1",
    alignItems: "center",
    justifyContent: "center",
    // Ring border
    borderWidth: 4,
    borderColor: "#FAFAFA",
    // Elevated shadow
    shadowColor: "#4169E1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  centerLabel: {
    fontSize: 10,
    color: "#4169E1",
    marginTop: 2,
    fontFamily: "Bricolage-Bold",
  },
});
