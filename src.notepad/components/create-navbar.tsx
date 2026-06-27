import { View, Text, StyleSheet } from "react-native";
import { AppButton } from "./button";
import {
  Home,
  PlusCircleIcon,
  SaveIcon,
  Search,
  SettingsIcon,
} from "lucide-react-native";
import { useCustomNavigation } from "@/context/custom-navigation";
import { useNoteStore } from "@/store/use-note-store";
import { toast } from '@/store/use-toast-store'; // Import the helperimport { useState } from "react";


export function CreateNavBar({ style, tabName, noteID }: any) {


const navigation = useCustomNavigation();
const generateId = () => {
    return 'xxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  
const id = noteID ? noteID : generateId();

const addOrUpdateNote = useNoteStore((state) => state.addOrUpdateNote);


const handleSaveOrUpdate = () => {
    addOrUpdateNote(id);
    navigation.push("Home");
    toast.show('success', 'Note saved successfully');
  }

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
        onPress={() => ["Edit", "Create"].includes(tabName) ? handleSaveOrUpdate() : navigation.push("Create")}
        style={[
          styles.default,
          {
            borderRadius: 60,
            borderWidth: 2,
            zIndex: 10,
            borderColor: "#5c5c5c08",
            position: "absolute",
            bottom: 40,
            backgroundColor: ["Edit", "Create"].includes(tabName) ? "#285effa9" : "white",
          },
        ]}
        icon={
            !["Create", "Edit"].includes(tabName) ? <PlusCircleIcon
            size={24}
            color={["Create", "Edit"].includes(tabName) ? "white" : "#000000ff"}
          />: 
            <SaveIcon
            size={24}
            color={["Create", "Edit"].includes(tabName) ? "white" : "#000000ff"}
          />
        }
        text={tabName != "Create" ? tabName == "Edit"? "Update" : "Save" : "Create"}
        innerStyle={{ flexDirection: "column", gap: 1 }}
        textStyle={{ color: ["Create", "Edit"].includes(tabName) ? "white" : "#000000ff" }}
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
