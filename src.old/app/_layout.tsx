import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { CustomStackNavigator, CustomScreen } from '../../src/context/custom-navigation';
import HomeScreen  from './screens/home';
import DetailsScreen from './screens/details';
import SearchScreen from './screens/search';
import CreateScreen from './screens/create';
import { useToastStore } from '../store/use-toast-store';
import { Toast } from '@/components/toast';
import { GlobalModal } from '@/components/global-modal';
// Prevent splash screen auto-hiding while loading fonts
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Bricolage-Regular': require('../../assets/Bricolage_Grotesque/static/BricolageGrotesque-Regular.ttf'), // Make sure to drop your font file here!
    'Bricolage-Bold': require('../../assets/Bricolage_Grotesque/static/BricolageGrotesque-Bold.ttf'),
  });
const { visible, type, message, description, hideToast } = useToastStore();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <>
    {/* 2. Global floating toast layer */}
      <Toast
        visible={visible}
        type={type}
        message={message}
        description={description}
        onClose={hideToast}
      />
      <GlobalModal />
      <CustomStackNavigator initialRouteName="Home">
      <CustomScreen name="Home" component={HomeScreen} />
      <CustomScreen name="Details" component={DetailsScreen} />
      <CustomScreen name="Search" component={SearchScreen} />
      <CustomScreen name="Create" component={CreateScreen} />
    </CustomStackNavigator>
    </>
  );
}