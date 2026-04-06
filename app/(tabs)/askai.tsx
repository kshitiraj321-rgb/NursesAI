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

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMode, setSelectedMode] = useState("explain");
  const [typingText, setTypingText] = useState("");
const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const askAI = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
    const thinkingMessage = { role: "assistant", content: "Thinking..." };

    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setQuestion("");

    try {
      const res = await fetch("https://nursesai.onrender.com/ask", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
 body: JSON.stringify({
  messages: [
    ...messages,
    { role: "user", content: question }
  ],
  mode: selectedMode,
}),
});

if (!res.ok) {
  throw new Error("Network response failed");
}

const data = await res.json();

if (!data || !data.answer) {
  throw new Error("Invalid response from server");
}

      // 🔥 REMOVE "Thinking..." first
setMessages((prev) => prev.slice(0, -1));

setIsTyping(true);
setTypingText("");

const fullText = data.answer;
let index = 0;

const interval = setInterval(() => {
  index++;

  setTypingText(fullText.slice(0, index));

  if (index >= fullText.length) {
    clearInterval(interval);

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: fullText },
    ]);

    setTypingText("");
    setIsTyping(false);
  }
}, 12); // speed (10–20 ideal)
    }catch (err: any) {
  console.log("ERROR:", err?.message || err);

  setMessages((prev) => {
    const updated = [...prev];
    updated[updated.length - 1] = {
      role: "assistant",
      content: "Server error. Try again.",
    };
    return updated;
  });
}
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "android" ? undefined : "padding"}
        keyboardVerticalOffset={0}
      >
        {/* 🔥 HEADER */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 10,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#111",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "600",
              marginBottom: 10,
            }}
          >
            NurseAI Assistant
          </Text>

          {/* 🔥 MODE BUTTONS */}
          <View style={{ flexDirection: "row" }}>
            {["explain", "quiz", "summary"].map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setSelectedMode(mode)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  marginRight: 8,
                  borderRadius: 20,
                  backgroundColor:
                    selectedMode === mode ? "#007AFF" : "#1c1c1e",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 13,
                    fontWeight: "500",
                  }}
                >
                  {mode.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 🔥 CHAT LIST */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{
            padding: 12,
            paddingBottom: 20,
          }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignSelf:
                  item.role === "user" ? "flex-end" : "flex-start",
                marginVertical: 6,
                maxWidth: "78%",
              }}
            >
              {/* 👇 AI Avatar */}
              {item.role === "assistant" && (
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#007AFF",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: "white" }}>🧑‍⚕️</Text>
                </View>
              )}

              {/* 💬 MESSAGE */}
            <View
  style={{
    backgroundColor:
      item.role === "user" ? "#0A84FF" : "#1c1c1e",

    paddingVertical: 10,
    paddingHorizontal: 14,

    borderRadius: 18,

    borderWidth: item.role === "assistant" ? 1 : 0,
    borderColor: "#2a2a2a",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,

    marginLeft: item.role === "user" ? 40 : 0,
    marginRight: item.role === "assistant" ? 40 : 0,
  }}
>
                <Text style={{ color: "white", lineHeight: 20 }}>
                  {item.content}
                </Text>
              </View>
            </View>
          )}
        />

        {/* 🔥 INPUT */}
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="Ask nursing questions..."
            placeholderTextColor="#888"
            style={{
              flex: 1,
              backgroundColor: "#1c1c1e",
              padding: 12,
              borderRadius: 12,
              color: "white",
            }}
          />
          {isTyping && (
  <View
    style={{
      flexDirection: "row",
      alignSelf: "flex-start",
      marginHorizontal: 12,
      marginBottom: 10,
    }}
  >
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
      }}
    >
      <Text style={{ color: "white" }}>🧑‍⚕️</Text>
    </View>

    <View
      style={{
        backgroundColor: "#1c1c1e",
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        maxWidth: "80%",
      }}
    >
      <Text style={{ color: "white", lineHeight: 20 }}>
        {typingText}
      </Text>
    </View>
  </View>
)}

          <TouchableOpacity
            onPress={askAI}
            style={{
              backgroundColor: "#007AFF",
              padding: 12,
              borderRadius: 12,
              marginLeft: 6,
            }}
          >
            <Text style={{ color: "white" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}