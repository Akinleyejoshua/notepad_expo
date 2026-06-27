import { View, Text, StyleSheet } from "react-native";
import { AppButton } from "./button";
import {
  Home,
  PlusCircleIcon,
  Search,
  SettingsIcon,
} from "lucide-react-native";
import { useCustomNavigation } from "@/context/custom-navigation";

export function HomeNavBar({ style, tabName, tabActive }: any) {
const navigation = useCustomNavigation();


  const styles = StyleSheet.create({
    default: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 100,
      backgroundColor: "white",
      borderWidth: 0,
      borderRadius: 20,
      padding: 10,
    },
  });

  return (
    <View
      style={[
        style,
        {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 1,
          gap: 50,
        },
      ]}
    >
      <AppButton
        onPress={() => navigation.push("Home")}
        style={[
          styles.default,
          { backgroundColor: tabName == "Home" ? "#285effa9" : "white" },
        ]}
        icon={
          <Home size={24} color={tabName == "Home" ? "white" : "#000000ff"} />
        }
        text="Home"
        innerStyle={{ flexDirection: "column", gap: 1 }}
        textStyle={{ color: tabName == "Home" ? "white" : "#000000ff" }}
      />
      <AppButton
        onPress={() => navigation.push("Create")}
        style={[
          styles.default,
          {
            borderRadius: 60,
            borderWidth: 2,
            zIndex: 10,
            borderColor: "#5c5c5c06",
            position: "absolute",
            bottom: 40,
            backgroundColor: tabName == "Create" ? "#285effa9" : "white",
          },
        ]}
        icon={
          <PlusCircleIcon
            size={24}
            color={tabName == "Create" ? "white" : "#000000ff"}
          />
        }
        text="Create"
        innerStyle={{ flexDirection: "column", gap: 1 }}
        textStyle={{ color: tabName == "Create" ? "white" : "#000000ff" }}
      />
      <AppButton
      onPress={() => navigation.push("Search")}
        style={[
          styles.default,
          { backgroundColor: tabName == "Search" ? "#285effa9" : "white" },
        ]}
        icon={
          <Search
            size={24}
            color={tabName == "Search" ? "white" : "#000000ff"}
          />
        }
        text="Search"
        innerStyle={{ flexDirection: "column", gap: 1 }}
        textStyle={{ color: tabName == "Search" ? "white" : "#000000ff" }}
      />
    </View>
  );
}
