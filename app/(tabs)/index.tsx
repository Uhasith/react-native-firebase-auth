import { Button, StyleSheet, SafeAreaView } from "react-native";
import { Text, View } from "@/components/Themed";
import { auth } from "@/FirebaseConfig";
import { router } from "expo-router"; // Import the router for navigation

export default function Home() {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace("/login");
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
