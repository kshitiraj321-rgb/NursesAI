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

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const askAI = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
    const thinkingMessage = { role: "assistant", content: "Thinking..." };

    // ✅ FIX: no duplicate
    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setQuestion("");

    try {
      const res = await fetch("https://nursesai.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: data.answer,
        };
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Error loading response",
        };
        return updated;
      });
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#000" }}
      behavior={Platform.OS === "android" ? "height" : "padding"}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: item.role === "user" ? "#007AFF" : "#333",
              padding: 10,
              borderRadius: 10,
              marginVertical: 5,
              maxWidth: "80%",
            }}
          >
            <Text style={{ color: "white" }}>{item.content}</Text>
          </View>
        )}
      />

      <View style={{ flexDirection: "row", padding: 10 }}>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Ask nursing questions..."
          placeholderTextColor="#888"
          style={{
            flex: 1,
            backgroundColor: "#1c1c1e",
            padding: 10,
            borderRadius: 10,
            color: "white",
          }}
        />

        <TouchableOpacity
          onPress={askAI}
          style={{
            backgroundColor: "#007AFF",
            padding: 10,
            borderRadius: 10,
            marginLeft: 5,
          }}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}