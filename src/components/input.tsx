import { TextInput, StyleSheet, View } from "react-native";

export function AppInput({icon, placeholder, value, onChange, style}: any){
    return (
        <View style={[styles.inputContainer, style]}>
            {icon && icon}
            <TextInput
                style={[styles.input]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChange}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 0,
        // marginLeft: 10,
        fontSize: 20,
        fontFamily: "Bricolage-Regular",
        width: "100%"
    },
    inputContainer: {
        borderWidth: 0,
        borderColor: "transparent",
        borderRadius: 50, 
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        // padding: 10,
        backgroundColor: "#f6f6f617",
        // paddingHorizontal: 30,
    }
});