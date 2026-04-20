import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { initializeAuth, getAuth, Auth } from "firebase/auth";
// @ts-ignore
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAIVDtEdRdg2NakpSweOSXwbCAI-fzto9s",
  authDomain: "nurseai-54b3b.firebaseapp.com",
  projectId: "nurseai-54b3b",
  storageBucket: "nurseai-54b3b.firebasestorage.app",
  messagingSenderId: "303629454220",
  appId: "1:303629454220:web:a0131ecceade9bc0d424a9",
  measurementId: "G-W1N8KN8L23"
};

let app: FirebaseApp;
let auth: Auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);

