import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';

export default function ToggleSwitch({
  on,
  onColor,
  disabled,
  onToggle,
}: {
  on: boolean;
  onColor: string;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onToggle}
      style={[styles.track, { backgroundColor: on ? onColor : COLORS.line, opacity: disabled ? 0.5 : 1 }]}
    >
      <View style={[styles.thumb, { left: on ? 21 : 3 }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: 40, height: 22, borderRadius: 11, justifyContent: 'center' },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    position: 'absolute',
  },
});
