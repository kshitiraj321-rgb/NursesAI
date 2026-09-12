import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { View, ActivityIndicator } from "react-native";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  uid: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  uid: null,
});

export const useAuth = () => useContext(AuthContext);

import { practiceRepository } from "../data/practice/repository";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        practiceRepository.clearLocalCache();
        setUser(u);
        setLoading(false);
      } else {
        setUser(u);
        await practiceRepository.loadUserProgress(u.uid);
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        uid: user ? user.uid : null,
      }}
    >
      {children}
      {loading && (
        <View className="absolute inset-0 bg-slate-50 dark:bg-slate-900 justify-center items-center z-50 flex-1">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      )}
    </AuthContext.Provider>
  );
}
