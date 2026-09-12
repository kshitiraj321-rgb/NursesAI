import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebase";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SecondaryButton } from "../components/ui/SecondaryButton";

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  const clearMessages = () => {
    setError(null);
    setSuccessMsg(null);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    clearMessages();
  };

  const validate = (isSignup = false) => {
    clearMessages();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setError("Please enter your password.");
      return false;
    }
    if (isSignup && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const login = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)" as any);
    } catch (e: any) {
      if (e.code === "auth/invalid-credential" || e.code === "auth/user-not-found" || e.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (e.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else if (e.code === "auth/network-request-failed") {
        setError("Network connection failed. Please check your internet.");
      } else {
        setError(e.message || "An error occurred during sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    if (!validate(true)) return;
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)" as any);
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        setError("An account already exists with this email.");
      } else if (e.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (e.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else {
        setError(e.message || "An error occurred during account creation.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    clearMessages();
    if (!email.trim()) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMsg("Password reset email sent. Please check your inbox.");
    } catch (e: any) {
      if (e.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (e.code === "auth/user-not-found" || e.code === "auth/missing-email") {
        setError("No account found with this email.");
      } else if (e.code === "auth/network-request-failed") {
        setError("Network connection failed.");
      } else {
        setError(e.message || "An error occurred during password reset.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="p-6 flex-1 justify-center max-w-md w-full self-center">
          <View className="mb-8">
            <Text className="text-slate-900 dark:text-slate-50 text-2xl font-bold tracking-tight mb-2">
              {isLoginMode ? "NurseAI" : "Create Account"}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              {isLoginMode 
                ? "Sign in to access your professional nursing education resources and personalized mastery tracking." 
                : "Join NurseAI to track your mastery, identify knowledge gaps, and prepare for exams."}
            </Text>
          </View>

          {error && (
            <View className="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-lg p-3 mb-6">
              <Text className="text-rose-600 dark:text-rose-400 text-sm font-medium">
                {error}
              </Text>
            </View>
          )}
          
          {successMsg && (
            <View className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 mb-6">
              <Text className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                {successMsg}
              </Text>
            </View>
          )}

          <View className="mb-4">
            <Text 
              nativeID="email-label"
              className="text-slate-900 dark:text-slate-50 text-sm font-semibold mb-1.5"
            >
              Email Address
            </Text>
            <TextInput
              accessibilityLabelledBy="email-label"
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 p-4 rounded-xl text-base border border-slate-200 dark:border-slate-700 min-h-[48px]"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
          </View>

          <View className="mb-6">
            <Text 
              nativeID="password-label"
              className="text-slate-900 dark:text-slate-50 text-sm font-semibold mb-1.5"
            >
              Password
            </Text>
            <TextInput
              accessibilityLabelledBy="password-label"
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 p-4 rounded-xl text-base border border-slate-200 dark:border-slate-700 min-h-[48px]"
              autoCapitalize="none"
              autoComplete="password"
              editable={!loading}
            />
            
            {isLoginMode && (
              <View className="items-end mt-2">
                <TouchableOpacity 
                  onPress={resetPassword} 
                  disabled={loading}
                  className="p-2 -mr-2"
                  accessibilityRole="button"
                  accessibilityLabel="Reset password"
                >
                  <Text className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View className="mt-2 space-y-3 gap-3">
            {isLoginMode ? (
              <>
                <PrimaryButton
                  label="Sign In"
                  onPress={login}
                  loading={loading}
                  disabled={loading}
                  variant="primary"
                />
                <SecondaryButton
                  label="Create Account"
                  onPress={toggleMode}
                  disabled={loading}
                />
              </>
            ) : (
              <>
                <PrimaryButton
                  label="Create Account"
                  onPress={signup}
                  loading={loading}
                  disabled={loading}
                  variant="primary"
                />
                <SecondaryButton
                  label="Back to Sign In"
                  onPress={toggleMode}
                  disabled={loading}
                />
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}