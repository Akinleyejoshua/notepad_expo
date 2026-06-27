import { TextInput, StyleSheet, View } from "react-native";

export function AppTextArea({icon, placeholder, value, onChange, style, inputStyle}: any){
    return (
        <View style={[styles.inputContainer, style]}>
            {icon && icon}
            <TextInput
                style={[styles.input, inputStyle]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChange}
                numberOfLines={100}
                multiline={true}
                textAlignVertical="top"          // 3. Android specific: Forces cursor to start at top-left, not center
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 0,
        fontSize: 30,
        fontFamily: "Bricolage-Regular",
        height: "100%",
        width: "100%",
    },
    inputContainer: {
        borderWidth: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
    }
});