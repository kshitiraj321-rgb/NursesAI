import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
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
      router.replace("/(tabs)" as any);
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)" as any);
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  const resetPassword = async () => {
    if (!email.trim()) {
      alert("Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent");
    } catch (e: any) {
      if (e.code === "auth/invalid-email") {
        alert("Invalid email address.");
      } else if (e.code === "auth/user-not-found" || e.code === "auth/missing-email") {
        alert("No account found with this email.");
      } else if (e.code === "auth/network-request-failed") {
        alert("Network failure. Please check your connection.");
      } else {
        alert(e.message);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-5 flex-1 justify-center -mt-16">
        <Text className="text-white text-3xl font-bold tracking-tight mb-2">
          NurseAI 
        </Text>
        <Text className="text-neutral-400 text-base mb-8">
          Sign in to access premium AI study resources.
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          className="bg-[#1c1c1e] text-white p-4 rounded-xl mt-2 text-[15px] border border-[#2c2c2e]"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="bg-[#1c1c1e] text-white p-4 rounded-xl mt-3 text-[15px] border border-[#2c2c2e]"
        />

        <TouchableOpacity onPress={resetPassword} className="mt-4 self-end pr-1">
          <Text className="text-blue-400 text-[14px] font-semibold tracking-wide">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={login}
          className="bg-blue-600 p-4 rounded-xl mt-8 items-center"
        >
          <Text className="text-white text-[15px] font-bold tracking-wide">
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={signup}
          className="bg-green-600 p-4 rounded-xl mt-3 items-center"
        >
          <Text className="text-white text-[15px] font-bold tracking-wide">
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}