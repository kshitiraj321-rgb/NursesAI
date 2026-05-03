import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const segments = useSegments();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, [initializing]);

  useEffect(() => {
    if (initializing) return;

    // Only route if fonts are loaded and layout is mounted
    if (fontsLoaded) {
      const inAuthGroup = segments[0] === 'login';

      if (!user && !inAuthGroup) {
        // Redirect to the login page.
        router.replace("/login" as any);
      } else if (user && inAuthGroup) {
        // Redirect away from the login page.
        router.replace("/(tabs)" as any);
      }
      
      // Hide splash screen when init is finished and fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [user, initializing, segments, fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="dailytopics" />
      <Stack.Screen name="topics" />
      <Stack.Screen name="topicDetail" />
      <Stack.Screen name="quiz" />
    </Stack>
  );
}
