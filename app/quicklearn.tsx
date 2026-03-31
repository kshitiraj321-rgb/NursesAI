import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function QuickLearn() {
  const [modalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const topics = [
    "Blood Pressure",
    "Pulse",
    "Injection",
    "First Aid",
    "CPR"
  ];

  const handleTopicPress = async (topic: string) => {
  setSelectedTopic(topic);
  setModalVisible(true);     // 👈 OPEN IMMEDIATELY
  setContent("Loading...");  // 👈 SHOW LOADING

  try {
    const res = await fetch("http://10.18.5.87:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: `Explain ${topic} for nursing students in a clean format:
- Definition
- Key points
- Important values
- Clinical importance
Use bullet points and keep it simple.`
      })
    });

    const data = await res.json();

    const formatted = data.answer
  .replace(/\*\*/g, "")          // remove **
  .replace(/\n/g, "\n\n");       // add spacing

setContent(formatted);

  } catch (error) {
    setContent("Error loading explanation");
  }
};

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#000" }}>
      
      <Text style={{ color: "white", fontSize: 24, marginBottom: 20 }}>
        Quick Learn 📚
      </Text>

      {topics.map((topic, index) => (
        <TouchableOpacity
          key={index}
          style={{
            backgroundColor: "#1c1c1e",
            padding: 15,
            borderRadius: 10,
            marginBottom: 10
          }}
          onPress={() => handleTopicPress(topic)}
        >
          <Text
           style={{
            color: "white",
            fontSize: 16,
            lineHeight: 26,
            letterSpacing: 0.3
            }}
            >
            {topic}
          </Text>
        </TouchableOpacity>
      ))}

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "#000", padding: 20 }}>

          <Text style={{ color: "white", fontSize: 22, marginBottom: 10 }}>
          {selectedTopic}
         </Text>

         <ScrollView>
  <View
    style={{
      backgroundColor: "#1c1c1e",
      padding: 15,
      borderRadius: 10
    }}
  >
    {content.split("\n").map((line, index) => (
      <Text
        key={index}
        style={{
          color: line.trim().length < 20 ? "#4FC3F7" : "white",
          fontSize: line.trim().length < 20 ? 18 : 16,
          fontWeight: line.trim().length < 20 ? "bold" : "normal",
          marginBottom: 6
        }}
      >
        {line}
      </Text>
    ))}
  </View>
</ScrollView>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              backgroundColor: "#007AFF",
              padding: 15,
              borderRadius: 10,
              marginTop: 20,
              alignItems: "center"
            }}
          >
            <Text style={{ color: "white" }}>Close</Text>
          </TouchableOpacity>

        </View>
      </Modal>

    </View>
  );
}