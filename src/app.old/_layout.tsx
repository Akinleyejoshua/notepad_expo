import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

// Prevent splash screen auto-hiding while loading fonts
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Bricolage-Regular': require('../../assets/Bricolage_Grotesque/static/BricolageGrotesque-Regular.ttf'), // Make sure to drop your font file here!
    'Bricolage-Bold': require('../../assets/Bricolage_Grotesque/static/BricolageGrotesque-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontFamily: 'Bricolage-Bold', fontSize: 18 },
          headerTintColor: '#111',
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: 'My Notes' }} />
        <Stack.Screen name="note/[id]" options={{ title: '' }} />
      </Stack>
    </>
  );
}