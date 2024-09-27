import React, { useState, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { auth, db } from "@/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Profile() {
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({ name: "", address: "", phone: "" });

  const user = auth.currentUser; // Get the current user

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || "");
            setUserAddress(userData.address || "");
            setUserPhone(userData.phone || "");
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    // Validate that all fields are filled
    if (!userName || !userAddress || !userPhone) {
      Alert.alert("All fields (Name, Address, and Phone) are required.");
      return;
    }

    if (user) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          name: userName,
          address: userAddress,
          phone: userPhone,
        });
        setIsEditing(false); // Exit edit mode after saving
        alert("Profile updated successfully!");
      } catch (error) {
        console.log("Error updating user data:", error);
        alert("Failed to update profile.");
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.title}>My Profile</Text>

        {isEditing ? (
          // Edit Mode
          <>
            <View style={styles.inputWrapper}>
              <FontAwesome
                name="user"
                size={24}
                color="#888"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={userName}
                onChangeText={setUserName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <FontAwesome
                name="map-marker"
                size={24}
                color="#888"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={userAddress}
                onChangeText={setUserAddress}
              />
            </View>

            <View style={styles.inputWrapper}>
              <FontAwesome
                name="phone"
                size={24}
                color="#888"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={userPhone}
                onChangeText={setUserPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // View Mode
          <>
            <View style={styles.detailWrapper}>
              <FontAwesome
                name="user"
                size={24}
                color="#888"
                style={styles.icon}
              />
              <Text style={styles.label}>Name: {userName}</Text>
            </View>

            <View style={styles.detailWrapper}>
              <FontAwesome
                name="map-marker"
                size={24}
                color="#888"
                style={styles.icon}
              />
              <Text style={styles.label}>Address: {userAddress}</Text>
            </View>

            <View style={styles.detailWrapper}>
              <FontAwesome
                name="phone"
                size={24}
                color="#888"
                style={styles.icon}
              />
              <Text style={styles.label}>Phone: {userPhone}</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
    backgroundColor: "#f5f5f5",
    padding: 20,
    margin: 20,
  },
  profileContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
  },
  detailWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
