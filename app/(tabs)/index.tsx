import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#000000", "#0f172a"]}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      {/* TITLE */}
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: "white",
          marginBottom: 10,
        }}
      >
        </Text>
        <View style={{ alignItems: "center", marginBottom: 30 }}>

  <Image
    source={require("../../assets/images/nurse.png")}
    style={{
      width: 120,
      height: 182,
      borderRadius: 25,
      marginBottom: 15,
    }}
   >
    </Image>

  <Text
    style={{
      fontSize: 32,
      fontWeight: "bold",
      color: "white",
      textAlign: "center",
    }}
  >
    NursesAI 🧠
  </Text>

  <Text
    style={{
      color: "#aaa",
      fontSize: 16,
      marginTop: 5,
      textAlign: "center",
    }}
  >
    Your smart nursing assistant
  </Text>

</View>

      {/* QUICK LEARN */}
      <TouchableOpacity
        style={{
          width: "100%",
          backgroundColor: "#1c1c1e",
          padding: 20,
          borderRadius: 15,
          marginBottom: 20,
        }}
        onPress={() => router.push("/quicklearn")}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="book-outline" size={22} color="white" />
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            Quick Learn
          </Text>
        </View>

        <Text style={{ color: "#aaa", marginTop: 5 }}>
          Learn nursing topics quickly
        </Text>
      </TouchableOpacity>

      {/* ASK AI */}
      <TouchableOpacity
        onPress={() => router.push("/askai")}
        style={{
          width: "100%",
          backgroundColor: "#007AFF",
          padding: 20,
          borderRadius: 15,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color="white"
          />
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            Ask AI
          </Text>
        </View>

        <Text style={{ color: "white", marginTop: 5 }}>
          Ask anything instantly
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}