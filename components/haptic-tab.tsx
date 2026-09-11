import { Pressable, PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: PressableProps) {
  return (
    <Pressable
      {...props}
      onPressIn={(ev) => {
        try {
          // Soft tactile feedback on iOS & Android tab press
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {
          // Haptic failure must never prevent or block navigation
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}

