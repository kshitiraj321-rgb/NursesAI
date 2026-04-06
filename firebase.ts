import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIVDtEdRdg2NakpSweOSXwbCAI-fzto9s",
  authDomain: "nurseai-54b3b.firebaseapp.com",
  projectId: "nurseai-54b3b",
  storageBucket: "nurseai-54b3b.firebasestorage.app",
  messagingSenderId: "303629454220",
  appId: "1:303629454220:web:a0131ecceade9bc0d424a9",
  measurementId: "G-W1N8KN8L23"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = firebase.app();

export const auth = app.auth();
export const db = app.firestore();
