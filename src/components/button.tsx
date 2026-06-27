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
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7}>
      <View
        style={[
          {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
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
