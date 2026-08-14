import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONT_MONO } from '../theme/theme';
import { LightDevice } from '../data/data';
import SignalBars from '../components/SignalBars';
import ToggleSwitch from '../components/ToggleSwitch';

export default function RigScreen({
  devices,
  justAddedId,
  onOpenScan,
  onToggleOn,
}: {
  devices: LightDevice[];
  justAddedId: string | null;
  onOpenScan: () => void;
  onToggleOn: (id: string) => void;
}) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Every zone runs a different manufacturer's protocol — Convoy talks to all of them.
        </Text>
        <Pressable onPress={onOpenScan} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ ADD</Text>
        </Pressable>
      </View>

      {devices.map((d) => (
        <View
          key={d.id}
          style={[
            styles.card,
            {
              borderColor: d.id === justAddedId ? COLORS.teal : COLORS.line,
              opacity: d.connected ? 1 : 0.55,
            },
          ]}
        >
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.zoneRow}>
                <Text style={styles.zoneName}>{d.zone}</Text>
                {d.id === justAddedId && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
              </View>
              <Text style={styles.brandLine}>
                {d.brand} · {d.model}
              </Text>
              <Text style={styles.protocolLine}>{d.protocol}</Text>
            </View>
            <View style={styles.rightCol}>
              <SignalBars signal={d.signal} />
              <ToggleSwitch on={d.on} onColor={d.color} disabled={!d.connected} onToggle={() => onToggleOn(d.id)} />
            </View>
          </View>
          {!d.connected && <Text style={styles.notConnected}>not connected — pair from device settings</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 10 },
  headerText: { fontSize: 12, color: COLORS.textDim, maxWidth: 230 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.amberDim,
    borderWidth: 1,
    borderColor: COLORS.amber,
  },
  addButtonText: { fontSize: 12, fontWeight: '700', color: COLORS.amber },
  card: {
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  zoneName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  newBadge: { borderWidth: 1, borderColor: COLORS.teal, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  newBadgeText: { fontFamily: FONT_MONO, fontSize: 9, color: COLORS.teal },
  brandLine: { fontSize: 12, color: COLORS.textDim, marginTop: 1 },
  protocolLine: { fontFamily: FONT_MONO, fontSize: 10, color: COLORS.textDim, marginTop: 4 },
  rightCol: { alignItems: 'flex-end', gap: 8 },
  notConnected: { fontFamily: FONT_MONO, fontSize: 10, color: COLORS.red, marginTop: 8 },
});
