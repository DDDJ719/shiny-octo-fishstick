import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_MONO } from '../theme/theme';

export default function SignalBars({ signal }: { signal: number | null }) {
  if (signal === null) {
    return <Text style={styles.empty}>— — —</Text>;
  }
  const strength = signal > -55 ? 3 : signal > -68 ? 2 : 1;
  return (
    <View style={styles.row}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              height: 5 + i * 4,
              backgroundColor: i < strength ? COLORS.cyan : COLORS.line,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { fontFamily: FONT_MONO, fontSize: 11, color: COLORS.textDim },
  row: { flexDirection: 'row', gap: 2, alignItems: 'flex-end' },
  bar: { width: 3, borderRadius: 1 },
});
