import { ArrowLeft } from "lucide-react-native";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AppText } from "./app-text";
import { useCustomNavigation } from "@/context/custom-navigation";

export function HomeHeader({ title, style, hasBackButton, subtitle }: any) {
  const navigation = useCustomNavigation();

  return (
    <View style={[styles.headerOuter, style]}>
      <View style={styles.row}>
        {hasBackButton && (
          <TouchableOpacity
            onPress={() => navigation.pop()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color="#1A1A2E" />
          </TouchableOpacity>
        )}
        <View style={styles.titleBlock}>
          <AppText variant="default" style={styles.title}>
            {title}
          </AppText>
          {subtitle && (
            <AppText variant="caption" style={styles.subtitle}>
              {subtitle}
            </AppText>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerOuter: {
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F0F0F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  titleBlock: {
    flexDirection: "column",
  },
  title: {
    fontSize: 34,
    fontFamily: "Bricolage-Bold",
    color: "#1A1A2E",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E9A",
    marginTop: 2,
  },
});
