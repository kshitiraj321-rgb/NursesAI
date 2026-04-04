import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function QuickLearn() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const topics = ["CPR", "Injection", "First Aid", "Blood Pressure"];

  useFocusEffect(
    useCallback(() => {
      setSelectedTopic(null);
      setContent("");
    }, [])
  );

  const handleTopic = async (topic: string) => {
    setSelectedTopic(topic);
    setLoading(true);

    try {
      const res = await fetch("https://nursesai.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: topic }),
      });

      const data = await res.json();
      setContent(data.answer);
    } catch {
      setContent("Error loading");
    }

    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000", padding: 20 }}>
      {!selectedTopic ? (
        <>
          <Text style={{ color: "white", fontSize: 22 }}>
            Quick Learn 📚
          </Text>

          {topics.map((t, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleTopic(t)}
              style={{
                backgroundColor: "#1c1c1e",
                padding: 15,
                borderRadius: 10,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "white" }}>{t}</Text>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              setSelectedTopic(null);
              setContent("");
            }}
          >
            <Text style={{ color: "#007AFF" }}>← Back</Text>
          </TouchableOpacity>

          <Text style={{ color: "white", fontSize: 20 }}>
            {selectedTopic}
          </Text>

          {loading ? (
            <ActivityIndicator />
          ) : (
            <ScrollView>
              <Text style={{ color: "white" }}>{content}</Text>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}