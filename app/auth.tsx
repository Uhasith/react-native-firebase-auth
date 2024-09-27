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
  const [errorMessage, setErrorMessage] = useState("");
  const authUser = auth;

  // Helper function to validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Front-end validation before calling Firebase
  const validateForm = () => {
    if (!email) {
      setErrorMessage("Email is required.");
      return false;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setErrorMessage("Password is required.");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters.");
      return false;
    }
    setErrorMessage(""); // Clear any previous error message
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
      const user = await createUserWithEmailAndPassword(
        authUser,
        email,
        password
      );
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
          <ThemedText type="defaultSemiBold">Email</ThemedText>
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            style={styles.inputField}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
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
