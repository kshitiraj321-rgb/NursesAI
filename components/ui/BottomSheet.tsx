/**
 * NurseAI UI Primitive — BottomSheet
 *
 * Safe-area aware modal bottom sheet presentation component with backdrop dismiss.
 */

import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/70 justify-end">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-slate-900 border-t border-slate-700/80 rounded-t-3xl max-h-[85%]">
              <SafeAreaView edges={["bottom"]} className="p-4">
                {/* Header handle & Close button */}
                <View className="items-center mb-3">
                  <View className="w-10 h-1 bg-slate-700 rounded-full" />
                </View>

                {title && (
                  <View className="flex-row items-center justify-between mb-4 border-b border-slate-800 pb-3 px-1">
                    <Text className="text-white font-bold text-base">
                      {title}
                    </Text>
                    <TouchableOpacity
                      onPress={onClose}
                      accessibilityRole="button"
                      accessibilityLabel="Close sheet"
                    >
                      <Text className="text-cyan-400 font-bold text-sm">
                        Close ✕
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View>{children}</View>
              </SafeAreaView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
