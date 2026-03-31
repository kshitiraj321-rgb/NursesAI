import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const [loading, setLoading] = useState(false);

   const askAI = async () => {
  if (!question) return;

  const userMessage = { role: "user", content: question };
  setMessages(prev => [...prev, userMessage]);
  setQuestion("");
  setLoading(true);

  try {
  const res = await fetch("http://10.18.5.87:3000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question: question
    })
  });

  const data = await res.json();

  const aiMessage = {
    role: "assistant",
    content: data.answer
  };

  setMessages(prev => [...prev, aiMessage]);
  setLoading(false);

} catch (error) {
  setMessages(prev => [
    ...prev,
    { role: "assistant", content: "Error: " + error.message }
  ]);
  setLoading(false);
}

  setLoading(false);
};
useEffect(() => {
  scrollViewRef.current?.scrollToEnd({ animated: true });
}, [messages]);

  return (
    <View style={{ flex: 1 }}>

      <ScrollView
  ref={scrollViewRef}
        style={{ flex: 1, padding: 10 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {messages.map((msg, index) => (
          
          <View
            key={index}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#007AFF" : "#333",
              padding: 10,
              borderRadius: 10,
              marginVertical: 5,
              maxWidth: "80%"
            }}
          >
            <Text style={{ color: "white" }}>{msg.content}</Text>
          </View>
        ))}
        {loading && (
  <View
    style={{
      alignSelf: "flex-start",
      backgroundColor: "#333",
      padding: 10,
      borderRadius: 10,
      marginVertical: 5
    }}
  >
    <Text style={{ color: "white" }}>Thinking...</Text>
  </View>
)}
     </ScrollView>

<View
  style={{
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#333"
  }}
>

  {/* INPUT */}
  <TextInput
    placeholder="Ask something..."
    value={question}
    onChangeText={setQuestion}
    style={{
      flex: 1,
      borderWidth: 1,
      borderColor: "#555",
      borderRadius: 10,
      padding: 10,
      color: "white"
    }}
  />

  {/* SEND BUTTON */}
  <TouchableOpacity
    onPress={askAI}
    style={{
      backgroundColor: "#007AFF",
      padding: 10,
      borderRadius: 10,
      marginLeft: 5,
      justifyContent: "center"
    }}
  >
    <Text style={{ color: "white" }}>Send</Text>
  </TouchableOpacity>

  {/* MIC BUTTON */}
  <TouchableOpacity
    onPress={() => {
  setQuestion("Listening...");
}}
    style={{
      backgroundColor: "#34C759",
      padding: 10,
      borderRadius: 10,
      marginLeft: 5,
      justifyContent: "center"
    }}
  >
    <Text style={{ color: "white" }}>🎤</Text>
  </TouchableOpacity>

</View>

</View>
  );
}