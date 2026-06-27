import { useState, useMemo } from "react";
import { View, StyleSheet, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomNavigation } from "../../context/custom-navigation";
import { HomeHeader } from "@/components/home-header";
import { NoteItems } from "@/components/note-items";
import { useNoteStore } from "@/store/use-note-store";
import { BottomNav } from "@/components/bottom-nav";
import { AppText } from "@/components/app-text";
import { Search as SearchIcon, FileSearch } from "lucide-react-native";

export default function SearchScreen({ route }: { route: any }) {
  const navigation = useCustomNavigation();
  const notes = useNoteStore((state) => state.notes);
  const [query, setQuery] = useState("");

  // Filter notes by title or description match
  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [query, notes]);

  const showResults = query.trim().length > 0;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <HomeHeader
          title="Search"
          subtitle="Find your notes instantly"
          style={{ marginTop: 12 }}
          hasBackButton={true}
        />

        {/* Search input */}
        <View style={styles.searchBar}>
          <SearchIcon size={18} color="#8E8E9A" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            placeholderTextColor="#C8C8D0"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>

        {/* Results area */}
        <View style={styles.resultsArea}>
          {!showResults ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <FileSearch size={40} color="#4169E1" />
              </View>
              <AppText
                variant="bold"
                style={{ fontSize: 16, color: "#1A1A2E", marginTop: 16 }}
              >
                Start typing to search
              </AppText>
              <AppText
                variant="caption"
                style={{
                  textAlign: "center",
                  marginTop: 6,
                  lineHeight: 18,
                  paddingHorizontal: 32,
                }}
              >
                Search by title, description, or content
              </AppText>
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconCircle, { backgroundColor: "#FFF0F0" }]}>
                <FileSearch size={40} color="#FF6B6B" />
              </View>
              <AppText
                variant="bold"
                style={{ fontSize: 16, color: "#1A1A2E", marginTop: 16 }}
              >
                No results found
              </AppText>
              <AppText
                variant="caption"
                style={{
                  textAlign: "center",
                  marginTop: 6,
                  lineHeight: 18,
                  paddingHorizontal: 32,
                }}
              >
                Try a different keyword or phrase
              </AppText>
            </View>
          ) : (
            <>
              <AppText
                variant="caption"
                style={{ marginBottom: 12, marginTop: 4 }}
              >
                {filtered.length} {filtered.length === 1 ? "result" : "results"} found
              </AppText>
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <NoteItems item={item} index={index} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            </>
          )}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navWrapper}>
        <BottomNav activeTab="Search" />
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 20,
    gap: 10,
    shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Bricolage-Regular",
    color: "#1A1A2E",
    padding: 0,
  },
  resultsArea: {
    flex: 1,
    marginTop: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EBF0FB",
    alignItems: "center",
    justifyContent: "center",
  },
  navWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
});