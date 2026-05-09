import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebase";

import AskAIHeader from "../../components/AskAI/AskAIHeader";
import ChatBubble from "../../components/AskAI/ChatBubble";
import ChatInput from "../../components/AskAI/ChatInput";
import TypingIndicator from "../../components/AskAI/TypingIndicator";
import { searchPyq } from "../../data/pyq/repository";

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMode, setSelectedMode] = useState("summary");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackMap, setFeedbackMap] = useState<{ [key: string]: string }>({});
  const [showThanks, setShowThanks] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { prompt } = useLocalSearchParams();

  const buildRetrievalContext = async (userQuery: string): Promise<string> => {
    const hits = await searchPyq(userQuery);
    const top = hits.slice(0, 5);
    if (top.length === 0) return "";
    const lines = top.map((h, i) => `${i + 1}. [${h.subject} > ${h.subCategory} > ${h.topic}] ${h.question}`);
    return `\nUse these PYQ references if relevant:\n${lines.join("\n")}`;
  };

  const handleFeedback = async (messageId: string, type: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      if (feedbackMap[messageId]) return;

      await addDoc(collection(db, "users", user.uid, "feedback"), {
        messageId,
        type,
        createdAt: serverTimestamp(),
      });

      setFeedbackMap((prev) => ({
        ...prev,
        [messageId]: type,
      }));
      setShowThanks(true);

      setTimeout(() => {
        setShowThanks(false);
      }, 2000);
    } catch (error) {
      console.log("❌ Feedback error:", error);
    }
  };

  const askAI = async () => {
    if (!question.trim()) return;

    const user = auth.currentUser;
    if (!user) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      mode: selectedMode,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setIsTyping(true);

    await addDoc(collection(db, "users", user.uid, "messages"), {
      ...userMessage,
      createdAt: serverTimestamp(),
    });

    try {
      const retrieval = await buildRetrievalContext(question);
      const enrichedMessage = { ...userMessage, content: `${question}\n${retrieval}` };
      const token = await user.getIdToken();
      if (!token) throw new Error("Auth token missing");

      const response = await axios.post("https://nursesai.onrender.com/ask", {
        messages: [...messages, enrichedMessage],
        mode: selectedMode,
      }, { headers: { Authorization: `Bearer ${token}` } });

      const fullText = response.data.answer;
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
              msg.id === aiMessage.id ? { ...msg, content: fullText.slice(0, index) } : msg
            )
          );
        } else {
          clearInterval(interval);
        }
      }, 15);

      await addDoc(collection(db, "users", user.uid, "messages"), {
        ...aiMessage,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.log("AskAI error:", error);
      const errorMsg = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: "Our AI service is currently taking a quick nap or experiencing high demand. Please try asking again in a moment!",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  };

  const askAIWithPrompt = async (customPrompt: string) => {
    if (!customPrompt.trim()) return;

    const user = auth.currentUser;
    if (!user) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: customPrompt,
      mode: selectedMode,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setIsTyping(true);

    await addDoc(collection(db, "users", user.uid, "messages"), {
      ...userMessage,
      createdAt: serverTimestamp(),
    });

    try {
      const retrieval = await buildRetrievalContext(customPrompt);
      const enrichedMessage = { ...userMessage, content: `${customPrompt}\n${retrieval}` };
      const token = await user.getIdToken();
      if (!token) throw new Error("Auth token missing");

      const response = await axios.post("https://nursesai.onrender.com/ask", {
        messages: [...messages, enrichedMessage],
        mode: selectedMode,
      }, { headers: { Authorization: `Bearer ${token}` } });

      const fullText = response.data.answer;
      let index = 0;

      const aiMessage = {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        content: "",
        mode: selectedMode,
      };

      setMessages((prev) => [...prev, aiMessage]);

      const interval = setInterval(() => {
        if (index < fullText.length) {
          index++;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessage.id ? { ...msg, content: fullText.slice(0, index) } : msg
            )
          );
        } else {
          clearInterval(interval);
        }
      }, 15);

      await addDoc(collection(db, "users", user.uid, "messages"), {
        ...aiMessage,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.log("AskAI error:", error);
      const errorMsg = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content: "Our AI service is currently taking a quick nap or experiencing high demand. Please try asking again in a moment!",
        mode: selectedMode,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const loadMessages = async () => {
      const q = query(collection(db, "users", user.uid, "messages"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loaded);
    };

    loadMessages();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    if (prompt && typeof prompt === "string") {
      setQuestion(prompt);
      setTimeout(() => {
        askAIWithPrompt(prompt);
      }, 300);
    }
  }, [prompt]);

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredMessages = messages.filter(m => !m.mode || m.mode === selectedMode);

  const renderMessage = useCallback(
    ({ item, index }: any) => (
      <ChatBubble
        item={item}
        isSameSender={filteredMessages[index - 1]?.role === item.role}
        feedbackMap={feedbackMap}
        handleFeedback={handleFeedback}
        formatTime={formatTime}
      />
    ),
    [filteredMessages, feedbackMap]
  );

  const loadingText = selectedMode === "summary" 
    ? "Generating quick revision summary..." 
    : selectedMode === "fullAnswer" 
    ? "Generating detailed exam answer..." 
    : "Generating nursing quiz...";

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0F172A]"
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 25}
    >
      <View className="flex-1">
        <AskAIHeader selectedMode={selectedMode} setSelectedMode={setSelectedMode} />

        <FlatList
          ref={flatListRef}
          data={filteredMessages}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={{ padding: 12, paddingTop: 140, paddingBottom: 40 }}
          renderItem={renderMessage}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={Platform.OS === 'android'}
          keyboardShouldPersistTaps="handled"
        />

        <TypingIndicator isTyping={isTyping} text={loadingText} />

        {showThanks && (
          <View className="absolute bottom-24 self-center bg-[#1c1c1e] py-2 px-4 rounded-full border border-[#2a2a2a] z-50">
            <Text className="text-white text-[13px] font-medium">Thanks for your feedback 🙌</Text>
          </View>
        )}

        <ChatInput question={question} setQuestion={setQuestion} onSend={askAI} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}