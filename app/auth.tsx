import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import { auth } from "@/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";

const Page = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const authUser = auth;

  // Helper function to validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Front-end validation before calling Firebase
  const validateForm = () => {
    // If type is not 'login', validate name, address, and phone
    if (type !== "login") {
      if (!userName) {
        setErrorMessage("Name is required.");
        return false;
      }
    }

    if (!email) {
      setErrorMessage("Email is required.");
      return false;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (type !== "login") {
      if (!userAddress) {
        setErrorMessage("Address is required.");
        return false;
      }
      if (!userPhone) {
        setErrorMessage("Phone number is required.");
        return false;
      }

      const phoneRegex = /^[0-9]{10}$/; // Regular expression for 10-digit phone number
      if (!phoneRegex.test(userPhone)) {
        setErrorMessage("Please enter a valid 10-digit phone number.");
        return false;
      }
    }

    if (!password) {
      setErrorMessage("Password is required.");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const signIn = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(authUser, email, password);
      if (user) router.replace("/(tabs)/home");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Log in failed", error.message, [
        { text: "Cancel" },
        { text: "Try Again", onPress: () => signIn() },
      ]);
    }
    setLoading(false);
  };

  const signUp = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        authUser,
        email,
        password
      );

      const user = userCredential.user;

      // Now, store additional user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: userName, // Assuming you have collected userName, address, and phone
        address: userAddress,
        phone: userPhone,
        email: email,
      });

      if (user) router.replace("/(tabs)/home");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Sign up failed", error.message, [
        { text: "Cancel" },
        { text: "Try Again", onPress: () => signUp() },
      ]);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={1}
      >
        {loading && (
          <View style={defaultStyles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        <ThemedText
          style={{ marginBottom: 20, marginTop: 20, alignSelf: "center" }}
          type="title"
        >
          {type === "login" ? "Welcome back" : "Create your account"}
        </ThemedText>

        <View style={{ marginBottom: 20 }}>
          {type !== "login" && (
            <>
              <ThemedText type="defaultSemiBold">Name</ThemedText>
              <TextInput
                autoCapitalize="none"
                placeholder="Name"
                style={styles.inputField}
                value={userName}
                onChangeText={setUserName}
              />
            </>
          )}
          <ThemedText type="defaultSemiBold">Email</ThemedText>
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            style={styles.inputField}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {type !== "login" && (
            <>
              <ThemedText type="defaultSemiBold">Address</ThemedText>
              <TextInput
                autoCapitalize="none"
                placeholder="Address"
                style={styles.inputField}
                value={userAddress}
                onChangeText={setUserAddress}
              />
              <ThemedText type="defaultSemiBold">Phone</ThemedText>
              <TextInput
                autoCapitalize="none"
                placeholder="Phone"
                style={styles.inputField}
                value={userPhone}
                onChangeText={setUserPhone}
                keyboardType="phone-pad"
              />
            </>
          )}
          <ThemedText type="defaultSemiBold">Password</ThemedText>
          <TextInput
            autoCapitalize="none"
            placeholder="Password"
            style={styles.inputField}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Display error message */}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        {type === "login" ? (
          <TouchableOpacity
            onPress={signIn}
            style={[defaultStyles.btn, styles.btnPrimary]}
          >
            <Text style={styles.btnPrimaryText}>Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={signUp}
            style={[defaultStyles.btn, styles.btnPrimary]}
          >
            <Text style={styles.btnPrimaryText}>Create account</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
  btnPrimary: {
    backgroundColor: "#007bff",
    marginVertical: 4,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Page;
