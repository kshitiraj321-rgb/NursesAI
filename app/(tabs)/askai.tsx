import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
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
    question: question,
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

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: data.answer,
        };
        return updated;
      });
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
        behavior="height"
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
                maxWidth: "90%",
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
                    item.role === "user" ? "#007AFF" : "#1c1c1e",
                  padding: 12,
                  borderRadius: 16,
                  borderWidth: item.role === "assistant" ? 1 : 0,
                  borderColor: "#2a2a2a",
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