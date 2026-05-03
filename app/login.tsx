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