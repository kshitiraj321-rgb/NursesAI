import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../firebase";

  export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [selectedMode, setSelectedMode] = useState("explain");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState<{ [key: string]: string }>({});
  const [showThanks, setShowThanks] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
const handleFeedback = async (messageId: string, type: string) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    // ❌ prevent multiple clicks
    if (feedbackMap[messageId]) return;

    await addDoc(collection(db, "users", user.uid, "feedback"), {
      messageId,
      type,
      createdAt: serverTimestamp(),
    });

    // ✅ update UI state
    setFeedbackMap((prev) => ({
      ...prev,
      [messageId]: type,
    }));
    setShowThanks(true);

setTimeout(() => {
  setShowThanks(false);
}, 2000);

    console.log("✅ Feedback saved");
  } catch (error) {
    console.log("❌ Feedback error:", error);
  }
};
  const askAI = async () => {
    if (!question.trim()) return;

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setIsTyping(true); // 👈 START typing BEFORE API

    await addDoc(collection(db, "users", user.uid, "messages"), {
      ...userMessage,
      createdAt: serverTimestamp(),
    });

    try {
      const response = await fetch("https://nursesai.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          mode: selectedMode,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("API ERROR response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();

     const fullText = data.answer;
let index = 0;

const aiMessage = {
  id: Date.now().toString() + "-ai",
  role: "assistant",
  content: "",
};

setMessages((prev) => [...prev, aiMessage]);

const interval = setInterval(() => {
  if (index < fullText.length) {
    index++;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === aiMessage.id
          ? { ...msg, content: fullText.slice(0, index) }
          : msg
      )
    );
  } else {
    clearInterval(interval);
  }
}, 15); // speed (lower = faster)

      await addDoc(collection(db, "users", user.uid, "messages"), {
        ...aiMessage,
        createdAt: serverTimestamp(),
      });

    } catch (error) {
      console.log("AskAI error:", error);
    } finally {
      setIsTyping(false); // 👈 ALWAYS STOP typing
      setLoading(false);
    }
  };


  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const loadMessages = async () => {
      const q = query(
        collection(db, "users", user.uid, "messages"),
        orderBy("createdAt", "asc")
      );

      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map((doc: any) => ({
  id: doc.id, // ✅ FIX
  ...doc.data(),
}));
      setMessages(loaded);
    };

    loadMessages();
  }, []);
  const formatTime = (timestamp: any) => {
  if (!timestamp) return "";

  const date = timestamp.toDate();
  const now = new Date();

  const diff = (now.getTime() - date.getTime()) / 1000;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "android" ? "height" : "padding"}
        
      >
        {/* HEADER */}
        <View style={{ padding: 16 }}>
          <Text style={{ color: "white", fontSize: 20 }}>
            NurseAI Assistant
          </Text>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            {["explain", "quiz", "summary"].map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setSelectedMode(mode)}
                style={{
                  padding: 8,
                  marginRight: 8,
                  borderRadius: 20,
                  backgroundColor:
                    selectedMode === mode ? "#007AFF" : "#1c1c1e",
                }}
              >
                <Text style={{ color: "white" }}>{mode}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CHAT */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item, index }) => {
  const prevMessage = messages[index - 1];
  const isSameSender = prevMessage?.role === item.role;

  return (
            <View
              style={{
                alignSelf:
                item.role === "user" ? "flex-end" : "flex-start",
                marginTop: isSameSender ? 2 : 10,
                marginBottom: 2,
                maxWidth: "80%",
              }}
            >
              <View
                style={{
                  backgroundColor:
                    item.role === "user" ? "#0A84FF" : "#1c1c1e",
                  padding: 12,
                  borderTopLeftRadius:
                  item.role === "assistant"
                  ? isSameSender
                  ? 6
                 : 12
                 : 12,

                  borderTopRightRadius:
                 item.role === "user"
                 ? isSameSender
                 ? 6
                 : 12
                 : 12,

                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                }}
              >
              <Text style={{ color: "white" }}>{item.content}</Text>
                <Text
               style={{
               color: "#888",
                fontSize: 10,
                marginTop: 4,
               alignSelf: "flex-end",
               }}
                >
               {formatTime(item.createdAt)}
              </Text>

                {/* ✅ FEEDBACK */}
                {item.role === "assistant" && (
                  <View style={{ flexDirection: "row", marginTop: 6 }}>
                    <TouchableOpacity
                      disabled={!!feedbackMap[item.id]}
                     onPress={() => handleFeedback(item.id, "helpful")}
                     style={{
                     marginRight: 10,
                     opacity: feedbackMap[item.id] ? 0.5 : 1,
                     }}
                      >
                      <Text style={{ fontSize: 16 }}>
                     {feedbackMap[item.id] === "helpful" ? "✅ 👍" : "👍"}
                     </Text>
                      </TouchableOpacity>

                    <TouchableOpacity
                      disabled={!!feedbackMap[item.id]}
                     onPress={() => handleFeedback(item.id, "not_helpful")}
                     style={{
                     opacity: feedbackMap[item.id] ? 0.5 : 1,
                     }}
                     >
                      <Text style={{ fontSize: 16 }}>
                      {feedbackMap[item.id] === "not_helpful" ? "❌ 👎" : "👎"}
                     </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            );
            }}
            keyboardShouldPersistTaps="handled"
            />
            {/* ✅ TYPING INDICATOR HERE */}
          {isTyping && (
          <Text style={{ color: "#888", marginLeft: 12, marginBottom: 6 }}>
          NurseAI is typing...
          </Text>
        )}
        {showThanks && (
  <View
    style={{
      position: "absolute",
      bottom: 90,
      alignSelf: "center",
      backgroundColor: "#1c1c1e",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#2a2a2a",
    }}
  >
    <Text style={{ color: "white", fontSize: 13 }}>
      Thanks for your feedback 🙌
    </Text>
  </View>
)}

        {/* INPUT */}
        <View style={{ flexDirection: "row", padding: 10 }}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="Ask..."
            placeholderTextColor="#888"
            style={{
              flex: 1,
              backgroundColor: "#1c1c1e",
              padding: 10,
              color: "white",
              borderRadius: 10,
            }}
          />

          <TouchableOpacity
            onPress={askAI}
            style={{
              backgroundColor: "#007AFF",
              padding: 10,
              marginLeft: 8,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}