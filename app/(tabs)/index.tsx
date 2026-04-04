import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function HomeScreen() {
  const router = useRouter();
  const [dailyTopic, setDailyTopic] = useState("");
  useEffect(() => {
  const topics = [
    "Injection Techniques",
    "CPR",
    "Blood Pressure",
    "First Aid",
    "Pulse",
    "Infection Control",
  ];

  const today = new Date().getDate();
  const topic = topics[today % topics.length];

  setDailyTopic(topic);
}, []);

  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [user, setUser] = useState<any>(null);

  // 🔥 LISTEN TO USER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return unsubscribe;
  }, []);

  // 🔥 LOAD FIREBASE DATA
  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setCompletedCount(data.completedTopics?.length || 0);
          setStreak(data.streak || 0);
        }
      } catch (error) {
        console.log("Error loading Firebase data:", error);
      }
    };

    loadData();
  }, []);

  // 🔥 LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const totalTopics = 10;
  const progress = Math.min(completedCount / totalTopics, 1);

  return (
    <LinearGradient colors={["#000000", "#0f172a"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>

          {/* 👤 USER INFO */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: "#aaa", fontSize: 14 }}>
              Logged in as:
            </Text>

            <Text style={{ color: "white", fontSize: 16, marginBottom: 10 }}>
              {user ? user.email : "Loading..."}
            </Text>

            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: "#FF3B30",
                padding: 10,
                borderRadius: 10,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ color: "white" }}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* HEADER */}
          <Text style={{ color: "#aaa", fontSize: 14 }}>
            👋 Welcome back,
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 26,
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            Nurse 👩‍⚕️
          </Text>

          {/* DAILY TOPIC */}
          <View
            style={{
              backgroundColor: "#1c1c1e",
              padding: 20,
              borderRadius: 16,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "#58a6ff", fontWeight: "bold" }}>
              🔥 Daily Topic
            </Text>

            <Text style={{ color: "white", fontSize: 18, marginTop: 5 }}>
              {dailyTopic}
            </Text>

            {/* PROGRESS BAR */}
            <View
              style={{
                height: 6,
                backgroundColor: "#333",
                borderRadius: 5,
                marginTop: 10,
              }}
            >
              <View
                style={{
                  width: `${progress * 100}%`,
                  height: 6,
                  backgroundColor: "#007AFF",
                  borderRadius: 5,
                }}
              />
            </View>

            <TouchableOpacity
              onPress={() => router.push({
                pathname: "/dailytopics",
                params: { topic: dailyTopic },
              })}
              style={{
                marginTop: 15,
                backgroundColor: "#007AFF",
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Continue Learning
              </Text>
            </TouchableOpacity>
          </View>

          {/* QUICK ACTIONS */}
          <Text style={{ color: "#aaa", marginBottom: 10 }}>
            Quick Actions
          </Text>

          <View style={{ flexDirection: "row", gap: 10 }}>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/askai")}
              style={{
                flex: 1,
                backgroundColor: "#007AFF",
                padding: 15,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Ionicons name="chatbubble-outline" size={22} color="white" />
              <Text style={{ color: "white", marginTop: 5 }}>
                Ask AI
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/quicklearn")}
              style={{
                flex: 1,
                backgroundColor: "#1c1c1e",
                padding: 15,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Ionicons name="book-outline" size={22} color="white" />
              <Text style={{ color: "white", marginTop: 5 }}>
                Quick Learn
              </Text>
            </TouchableOpacity>

          </View>

          {/* PROGRESS */}
          <View
            style={{
              marginTop: 25,
              backgroundColor: "#1c1c1e",
              padding: 15,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              📊 Your Progress
            </Text>

            <Text style={{ color: "#aaa", marginTop: 5 }}>
              {completedCount} topics completed
            </Text>

            <Text style={{ color: "#aaa" }}>
              🔥 Streak: {streak} days
            </Text>
          </View>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}