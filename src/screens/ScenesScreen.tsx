import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONT_MONO } from '../theme/theme';
import { Scene, SCENES } from '../data/data';

export default function ScenesScreen({ onApplyScene }: { onApplyScene: (scene: Scene) => void }) {
  return (
    <View>
      <Text style={styles.intro}>One tap sets color, pattern and brightness across every connected zone.</Text>
      {SCENES.map((s) => (
        <Pressable key={s.name} onPress={() => onApplyScene(s)} style={styles.card}>
          <View style={[styles.swatch, { backgroundColor: s.color }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{s.name}</Text>
            <Text style={styles.desc}>{s.desc}</Text>
          </View>
          <Text style={styles.pattern}>{s.pattern}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 12, color: COLORS.textDim, marginBottom: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  swatch: { width: 40, height: 40, borderRadius: 10 },
  name: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  desc: { fontSize: 12, color: COLORS.textDim },
  pattern: { fontFamily: FONT_MONO, fontSize: 11, color: COLORS.textDim },
});
