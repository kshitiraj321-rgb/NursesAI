import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image, Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompletedCount(data.completedTopics?.length || 0);
          setStreak(data.streak || 0);
        }
      } catch (error) {
        // Offline handling
      }
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      // Silent
    }
  };

  const totalTopics = 10;
  const progress = Math.min(completedCount / totalTopics, 1);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good Morning," : hour < 17 ? "Good Afternoon," : "Good Evening,";

  // Staggered card animations
  const opacity1 = useSharedValue(0);
  const ty1 = useSharedValue(20);
  const opacity2 = useSharedValue(0);
  const ty2 = useSharedValue(20);
  const opacity3 = useSharedValue(0);
  const ty3 = useSharedValue(20);
  const opacity4 = useSharedValue(0);
  const ty4 = useSharedValue(20);

  useEffect(() => {
    opacity1.value = withTiming(1, { duration: 400 });
    ty1.value = withTiming(0, { duration: 400 });
    
    setTimeout(() => {
      opacity2.value = withTiming(1, { duration: 400 });
      ty2.value = withTiming(0, { duration: 400 });
    }, 100);
    
    setTimeout(() => {
      opacity3.value = withTiming(1, { duration: 400 });
      ty3.value = withTiming(0, { duration: 400 });
    }, 200);
    
    setTimeout(() => {
      opacity4.value = withTiming(1, { duration: 400 });
      ty4.value = withTiming(0, { duration: 400 });
    }, 300);
  }, []);

  const animatedCardStyle1 = useAnimatedStyle(() => ({
    opacity: opacity1.value,
    transform: [{ translateY: ty1.value }],
  }));
  const animatedCardStyle2 = useAnimatedStyle(() => ({
    opacity: opacity2.value,
    transform: [{ translateY: ty2.value }],
  }));
  const animatedCardStyle3 = useAnimatedStyle(() => ({
    opacity: opacity3.value,
    transform: [{ translateY: ty3.value }],
  }));
  const animatedCardStyle4 = useAnimatedStyle(() => ({
    opacity: opacity4.value,
    transform: [{ translateY: ty4.value }],
  }));

  const progressWidth = useSharedValue(0);
  useEffect(() => {
    progressWidth.value = withTiming(progress * 100, { duration: 800 });
  }, [progress]);

  const progressAnimStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const buttonScale = useSharedValue(1);
  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const triggerHaptic = (impact: any) => {
    Haptics.impactAsync(impact);
  };

  const onButtonPressIn = () => {
    buttonScale.value = withTiming(0.96, { duration: 150 });
  };

  const insets = useSafeAreaInsets();

  const onButtonPressOut = (callback: () => void) => {
    buttonScale.value = withTiming(1, { duration: 150 }, () => {
      runOnJS(callback)();
    });
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const AnimatedView = Animated.createAnimatedComponent(View);

  return (
    <LinearGradient colors={['#0B0F1A', '#0E1A2B']} style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: insets.bottom + 8 }}>
        <AnimatedView style={[animatedCardStyle1, { alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 16, marginBottom: 8, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderRadius: 20, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 }]}>
          <TouchableOpacity 
            onPress={handleLogout}
            activeOpacity={0.7}
            style={{ alignSelf: 'flex-end' }}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
              Logout
            </Text>
          </TouchableOpacity>
        </AnimatedView>

        <Text style={{ 
          color: "#9CA3AF", 
          fontSize: 16, 
          fontWeight: "600",
          marginBottom: 2 
        }}>
          {greeting}
        </Text>
        <View
  style={{
    alignSelf: "flex-start",
    backgroundColor: "rgba(96,165,250,0.10)",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 2,
  }}
>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text
      style={{
        fontSize: 30,
        fontWeight: "bold",
        color: "#3B82F6",
      }}
    >
      Nurse
    </Text>

    <Image
  source={require("../../assets/images/nurse-avatar.png")}
  style={{
    width: 34,
    height: 34,
    borderRadius: 15,
    marginLeft: 8,
    borderWidth: 2,
    borderColor: "#60A5FA",
  }}
/>
  </View>
</View>

        <Text style={{
          color: "#9CA3AF",
          fontSize: 15,
          fontWeight: "500",
          marginBottom: 16,
          lineHeight: 20,
        }}>
          Smart learning for nurses
        </Text>

        {/* Daily Focus Card - Compact */}
        <AnimatedView style={[
          animatedCardStyle2, 
          { 
            backgroundColor: 'rgba(255,255,255,0.08)', 
            borderColor: 'rgba(255,255,255,0.15)', 
            borderWidth: 1, 
            borderRadius: 20, 
            padding: 14,
            marginBottom: 12,
            shadowColor: '#000', 
            shadowOffset: {width: 0, height: 8}, 
            shadowOpacity: 0.2, 
            shadowRadius: 12, 
            elevation: 8,
          }
        ]}>
          <View style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 40,
            height: 40,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: 20,
            opacity: 0.6,
          }} />

          <Text style={{
            color: "#60A5FA",
            fontSize: 17,
            fontWeight: "700",
            marginBottom: 4,
          }}>
            Daily Focus
          </Text>

          <Text style={{
            color: "white",
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 8,
            lineHeight: 24,
          }}>
            {dailyTopic}
          </Text>

          <View style={{
            height: 6,
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1,
            borderRadius: 4,
            marginBottom: 12,
            overflow: "hidden",
            shadowColor: '#60A5FA',
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}>
            <AnimatedView style={[
              progressAnimStyle,
              {
                height: "100%",
                borderRadius: 4,
                shadowColor: '#60A5FA',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.4,
                shadowRadius: 8,
              }
            ]}>
              <LinearGradient
                colors={['#60A5FA', '#3B82F6']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{flex: 1}}
              />
            </AnimatedView>
          </View>

          <AnimatedTouchable
            style={[
              buttonAnimStyle,
              {
                backgroundColor: "#3B82F6",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 16,
                alignItems: "center",
                shadowColor: '#3B82F6',
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }
            ]}
            onPressIn={onButtonPressIn}
            onPressOut={() => onButtonPressOut(() => {
              triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
              router.push({
                pathname: "/dailytopics",
                params: { topic: dailyTopic },
              });
            })}
          >
            <Text style={{
              color: "white",
              fontSize: 15,
              fontWeight: "700",
            }}>
              Continue
            </Text>
          </AnimatedTouchable>
        </AnimatedView>

        <Text style={{
          color: "#9CA3AF",
          fontSize: 16,
          fontWeight: "600",
          marginBottom: 12,
        }}>
          Quick Actions
        </Text>

        {/* Quick Actions - Compact height ~100 */}
        <AnimatedView style={[animatedCardStyle3, { flexDirection: "row", gap: 12, marginBottom: 12 }]}>
          <AnimatedTouchable
            style={[
              buttonAnimStyle,
              {
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderColor: 'rgba(255,255,255,0.15)',
                borderWidth: 1,
                padding: 14,
                borderRadius: 20,
                alignItems: "center",
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 6},
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 6,
              }
            ]}
            onPressIn={onButtonPressIn}
            onPressOut={() => onButtonPressOut(() => {
              triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(tabs)/askai");
            })}
          >
            <View style={{
              backgroundColor: 'rgba(96, 165, 250, 0.3)',
              borderColor: 'rgba(96, 165, 250, 0.4)',
              borderWidth: 1,
              width: 48,
              height: 48,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 6,
            }}>
              <Ionicons name="chatbubble-outline" size={20} color="#60A5FA" />
            </View>
            <Text style={{
              color: "white",
              fontSize: 15,
              fontWeight: "700",
              textAlign: "center",
            }}>
              Ask AI
            </Text>
          </AnimatedTouchable>

          <AnimatedTouchable
            style={[
              buttonAnimStyle,
              {
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderColor: 'rgba(255,255,255,0.15)',
                borderWidth: 1,
                padding: 14,
                borderRadius: 20,
                alignItems: "center",
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 6},
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 6,
              }
            ]}
            onPressIn={onButtonPressIn}
            onPressOut={() => onButtonPressOut(() => {
              triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(tabs)/quicklearn");
            })}
          >
            <View style={{
              backgroundColor: 'rgba(107, 114, 128, 0.3)',
              borderColor: 'rgba(107, 114, 128, 0.4)',
              borderWidth: 1,
              width: 48,
              height: 48,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 6,
            }}>
              <Ionicons name="book-outline" size={20} color="#9CA3AF" />
            </View>
            <Text style={{
              color: "white",
              fontSize: 15,
              fontWeight: "700",
              textAlign: "center",
            }}>
              Quick Learn
            </Text>
          </AnimatedTouchable>
        </AnimatedView>

        {/* Progress Card - Compact */}
        <AnimatedView style={[
          animatedCardStyle4,
          {
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderColor: 'rgba(255,255,255,0.15)',
            borderWidth: 1,
            borderRadius: 20,
            padding: 14,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 8},
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
          }
        ]}>
          <View style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 36,
            height: 36,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: 18,
            opacity: 0.5,
          }} />

          <Text style={{
            color: "white",
            fontSize: 17,
            fontWeight: "700",
            marginBottom: 4,
          }}>
            Progress
          </Text>

          <Text style={{
            color: "#9CA3AF",
            fontSize: 14,
            marginBottom: 8,
            fontWeight: "500",
          }}>
            {completedCount}/{totalTopics} topics
          </Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}>
            <Text style={{
              color: "#60A5FA",
              fontSize: 22,
              fontWeight: "800",
            }}>
              {streak}
            </Text>
            <Text style={{
              color: "#F59E0B",
              fontSize: 18,
            }}>
              🔥
            </Text>
            <Text style={{
              color: "#9CA3AF",
              fontSize: 14,
            }}>
              streak
            </Text>
          </View>
        </AnimatedView>

        {/* Compact Disclaimer */}
        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <Text style={{
            color: 'rgba(156, 163, 175, 0.6)',
            fontSize: 11,
            textAlign: 'center',
            lineHeight: 14,
            paddingHorizontal: 8,
          }}>
            Premium AI features • Practice safely
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
