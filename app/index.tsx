import { useEffect, useState } from "react";
import { View, ActivityIndicator, SafeAreaView } from "react-native";
import { auth } from "@/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { router } from "expo-router";
import AnimatedIntro from "@/components/AnimatedIntro";
import BottomLoginSheet from "@/components/BottomLoginSheet";

export default function Index() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user: any) => {
      setUser(user);
      setLoading(false);

      // Redirect to tabs screen if user is logged in
      if (user) {
        router.push("/(tabs)/home");
      }
    });

    return subscriber; // Unsubscribe on unmount
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If not logged in, show the intro and login sheet
  return (
      <View style={{ flex: 1 }}>
        <AnimatedIntro />
        <BottomLoginSheet />
      </View>
  );
}
