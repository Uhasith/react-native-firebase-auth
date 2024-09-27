import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { auth } from "@/FirebaseConfig";
import { Pressable, Text } from "react-native";
import { Colors, ColorPalette } from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { getAuth } from "firebase/auth";
import { router } from "expo-router";

// Icon component for the tab bar
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);

  // Sign out function
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace("/auth");
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  };

  // Set up the Firebase auth listener
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      setIsLoading(false); // Auth check done, stop loading
      if (!user) {
        router.replace("/auth"); // Redirect if not logged in
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Show loading text until the auth state is known
  if (isLoading) return <Text style={{ paddingTop: 30 }}>Loading...</Text>;

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true, // Ensure header is shown
        headerRight: () => (
          <Pressable onPress={handleSignOut}>
            {({ pressed }) => (
              <FontAwesome
                name="power-off"
                size={25}
                color={ColorPalette.orange}
                style={{ marginRight: 25, opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
