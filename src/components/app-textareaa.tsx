import { TextInput, StyleSheet, View } from "react-native";

export function AppTextArea({ icon, placeholder, value, onChange, style, inputStyle }: any) {
  return (
    <View style={[styles.inputContainer, style]}>
      {icon && icon}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#C8C8D0"
        value={value}
        onChangeText={onChange}
        numberOfLines={100}
        multiline={true}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
    fontSize: 28,
    fontFamily: "Bricolage-Regular",
    color: "#1A1A2E",
    height: "100%",
    width: "100%",
  },
  inputContainer: {
    borderWidth: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
});