// src/screens/HomeScreen.tsx
import { View, Text, Button, StyleSheet } from 'react-native';
import { useCustomNavigation } from '../../context/custom-navigation';

// src/screens/DetailsScreen.tsx
export default function SearchScreen({ route }: { route: any }) {
  const navigation = useCustomNavigation();
  const { noteId } = route.params || {};

  return (
    <View>
      <Text>Search</Text>
    </View>
  );
}
const styles = StyleSheet.create({

});