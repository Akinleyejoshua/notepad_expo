import {
  SettingsIcon,
  MenuIcon,
  ArrowBigLeft,
  ArrowLeft,
} from "lucide-react-native";
import { View, StyleSheet } from "react-native";
import { AppText } from "./app-text";
import { AppButton } from "./button";
import { useCustomNavigation } from "@/context/custom-navigation";

export function HomeHeader({ title, style, hasBackButton }: any) {
  const navigation = useCustomNavigation();
  return (
    /* Layer 1: Acts strictly as the physical engine dropping the shadow shadow wrapper */
    <View style={[style]}>
      {/* Layer 2: Masks content and clips the background border radius perfectly */}
      <View style={styles.headerContainer}>
        <View style={styles.nav}>
          <View style={styles.leftNav}>
            {hasBackButton && (
              <AppButton
                onPress={() => navigation.pop()}
                icon={<ArrowLeft size={30} color={"#ffffffff"} />}
                style={{
                    backgroundColor: "#0f71e2cc",
                    borderRadius: 20,
                    padding: 10,
                    width: 50,
                    height: 50,
                    marginRight: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                
              />
            )}
            <AppText variant="default" style={styles.headerTitle}>
              {title}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    // 3. Clip everything cleanly right down the edge boundary!
    // borderRadius: 50,
    // overflow: 'hidden',
    // backgroundColor: "#ffffff",
    // paddingHorizontal: 20,
    // paddingVertical: 20,
    // shadowColor: "#00000050",
    // shadowOffset: {
    //     width: 0,
    //     height: 4, // Pushes shadow down slightly below the capsule line
    // },
    // shadowOpacity: 0.32,
    // shadowRadius: 16,
    // elevation: 10,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 50,
    marginLeft: 0,
  },
});
