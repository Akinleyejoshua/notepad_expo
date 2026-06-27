import { TouchableOpacity, View } from "react-native";
import { AppText } from "./app-text";

export function AppButton({
  text,
  icon,
  onPress,
  style,
  textStyle,
  innerStyle,
}: any) {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <View
        style={[
          {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          },

          innerStyle,

        ]}
      >
        {icon && icon}
        {text && (
          <AppText style={textStyle} variant="default">
            {text}
          </AppText>
        )}
      </View>
    </TouchableOpacity>
  );
}
