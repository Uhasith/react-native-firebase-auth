// FirebaseConfig.ts
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqNMEkThGopg6OWKyGOF71fhuDDDxE0PI",
  authDomain: "doggy-food-b1252.firebaseapp.com",
  projectId: "doggy-food-b1252",
  storageBucket: "doggy-food-b1252.appspot.com",
  messagingSenderId: "551856074814",
  appId: "1:551856074814:web:8edc72a94c31600c24a16f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, auth, db };
