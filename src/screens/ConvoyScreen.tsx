import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { COLORS, FONT_MONO } from '../theme/theme';
import { LightDevice, LogEntry, PATTERNS, SWATCHES } from '../data/data';
import GaugeDial from '../components/GaugeDial';
import Pulse from '../components/Pulse';

export default function ConvoyScreen({
  brightness,
  setBrightness,
  connectedDevices,
  selectedDevices,
  toggleSelect,
  toggleSelectAll,
  masterColor,
  setMasterColor,
  masterPattern,
  setMasterPattern,
  syncing,
  syncedIds,
  log,
  onSync,
}: {
  brightness: number;
  setBrightness: (v: number) => void;
  connectedDevices: LightDevice[];
  selectedDevices: LightDevice[];
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  masterColor: string;
  setMasterColor: (c: string) => void;
  masterPattern: string;
  setMasterPattern: (p: string) => void;
  syncing: boolean;
  syncedIds: Record<string, boolean>;
  log: LogEntry[];
  onSync: () => void;
}) {
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [log]);

  const allSelected = selectedDevices.length === connectedDevices.length && connectedDevices.length > 0;
  const syncDisabled = selectedDevices.length === 0 || syncing;

  return (
    <View>
      <View style={styles.dialWrap}>
        <GaugeDial value={brightness} onChange={setBrightness} />
      </View>

      <Pressable onPress={toggleSelectAll} style={styles.selectAllRow}>
        <Text style={styles.selectAllText}>
          {selectedDevices.length} of {connectedDevices.length} zones selected
        </Text>
        <Text style={styles.selectAllAction}>{allSelected ? 'Deselect all' : 'Select all'}</Text>
      </Pressable>

      <View style={styles.chipRow}>
        {connectedDevices.map((d) => (
          <Pressable
            key={d.id}
            onPress={() => toggleSelect(d.id)}
            style={[
              styles.chip,
              { borderColor: d.selected ? COLORS.amber : COLORS.line, backgroundColor: d.selected ? COLORS.amberDim : 'transparent' },
            ]}
          >
            <Pulse
              active={syncing && d.selected && !syncedIds[d.id]}
              style={[styles.chipDot, { backgroundColor: syncedIds[d.id] ? COLORS.teal : d.color }]}
            />
            <Text style={[styles.chipText, { color: d.selected ? COLORS.text : COLORS.textDim }]}>
              {d.zone.split(' — ')[0].split(' ')[0]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionLabel}>COLOR</Text>
      <View style={styles.swatchRow}>
        {SWATCHES.map((c) => (
          <Pressable
            key={c}
            onPress={() => setMasterColor(c)}
            style={[
              styles.swatch,
              { backgroundColor: c, borderColor: masterColor === c ? COLORS.text : 'transparent' },
            ]}
          />
        ))}
      </View>

      <Text style={styles.sectionLabel}>PATTERN</Text>
      <View style={styles.patternRow}>
        {PATTERNS.map((p) => (
          <Pressable
            key={p}
            onPress={() => setMasterPattern(p)}
            style={[
              styles.patternChip,
              {
                backgroundColor: masterPattern === p ? COLORS.amber : COLORS.panel,
                borderColor: masterPattern === p ? COLORS.amber : COLORS.line,
              },
            ]}
          >
            <Text style={[styles.patternText, { color: masterPattern === p ? '#1A1200' : COLORS.text }]}>{p}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => !syncDisabled && onSync()}
        disabled={syncDisabled}
        style={[
          styles.syncButton,
          { backgroundColor: selectedDevices.length === 0 ? COLORS.line : syncing ? COLORS.panel2 : COLORS.amber },
        ]}
      >
        <Text
          style={[
            styles.syncButtonText,
            { color: syncing ? COLORS.amber : selectedDevices.length === 0 ? COLORS.textDim : '#1A1200' },
          ]}
        >
          {syncing ? 'SYNCING...' : 'SYNC TO CONVOY'}
        </Text>
      </Pressable>

      {log.length > 0 && (
        <ScrollView ref={scrollRef} style={styles.logBox} contentContainerStyle={{ padding: 12 }}>
          {log.map((l, i) => (
            <Text
              key={i}
              style={[
                styles.logLine,
                { color: l.kind === 'ok' ? COLORS.teal : l.kind === 'pending' ? COLORS.cyan : COLORS.textDim },
              ]}
            >
              {l.text}
            </Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dialWrap: { alignItems: 'center', marginBottom: 8 },
  selectAllRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.panel,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  selectAllText: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  selectAllAction: { fontSize: 12, color: COLORS.amber, fontWeight: '600' },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1 },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipText: { fontSize: 11 },
  sectionLabel: { fontSize: 11, color: COLORS.textDim, marginBottom: 8, letterSpacing: 1 },
  swatchRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  swatch: { width: 30, height: 30, borderRadius: 15, borderWidth: 2 },
  patternRow: { flexDirection: 'row', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  patternChip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1 },
  patternText: { fontSize: 12, fontWeight: '500' },
  syncButton: { padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 14 },
  syncButtonText: { fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  logBox: { backgroundColor: '#0D0F11', borderWidth: 1, borderColor: COLORS.line, borderRadius: 10, maxHeight: 130 },
  logLine: { fontFamily: FONT_MONO, fontSize: 10.5, marginBottom: 3, lineHeight: 15 },
});
