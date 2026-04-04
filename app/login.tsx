import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ padding: 20 }}>

        <Text style={{ color: "white", fontSize: 24 }}>
          NurseAI Login
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          style={{
            backgroundColor: "#1c1c1e",
            color: "white",
            padding: 10,
            borderRadius: 10,
            marginTop: 20,
          }}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            backgroundColor: "#1c1c1e",
            color: "white",
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
          }}
        />

        <TouchableOpacity
          onPress={login}
          style={{
            backgroundColor: "#007AFF",
            padding: 12,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={signup}
          style={{
            backgroundColor: "#34C759",
            padding: 12,
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Sign Up
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}