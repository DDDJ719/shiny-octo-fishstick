import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { COLORS, FONT_MONO } from '../theme/theme';
import { DiscoverableLight } from '../data/data';
import Pulse from '../components/Pulse';

export default function ScanOverlay({
  scanPhase,
  discovered,
  connectingKey,
  onClose,
  onConnect,
}: {
  scanPhase: 'idle' | 'scanning' | 'done';
  discovered: DiscoverableLight[];
  connectingKey: string | null;
  onClose: () => void;
  onConnect: (item: DiscoverableLight) => void;
}) {
  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>PAIR A LIGHT</Text>
          <Text style={styles.subtitle}>
            {scanPhase === 'scanning' ? 'scanning for BLE controllers...' : `${discovered.length} found`}
          </Text>
        </View>
        <Pressable onPress={onClose}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
      </View>

      <View style={styles.radarWrap}>
        <View style={styles.radar}>
          {scanPhase === 'scanning' && (
            <>
              <Pulse active style={[styles.ring, { width: 100, height: 100, borderRadius: 50 }]} />
              <Pulse active style={[styles.ring, { width: 68, height: 68, borderRadius: 34 }]} />
            </>
          )}
          <View style={[styles.dot, { backgroundColor: scanPhase === 'scanning' ? COLORS.cyan : COLORS.teal }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {discovered.length === 0 && scanPhase === 'scanning' && (
          <Text style={styles.hint}>Make sure the light is powered on and in pairing mode.</Text>
        )}
        {discovered.length === 0 && scanPhase === 'done' && (
          <Text style={styles.hint}>No new controllers found nearby.</Text>
        )}
        {discovered.map((item) => {
          const key = `${item.brand}-${item.model}`;
          const isConnecting = connectingKey === key;
          return (
            <View key={key} style={styles.card}>
              <View>
                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.model}>{item.model}</Text>
                <Text style={styles.protocol}>
                  {item.protocol} · {item.rssi} dBm
                </Text>
              </View>
              <Pressable
                disabled={isConnecting}
                onPress={() => onConnect(item)}
                style={[styles.connectButton, { backgroundColor: isConnecting ? COLORS.panel2 : COLORS.amber }]}
              >
                <Text style={[styles.connectText, { color: isConnecting ? COLORS.amber : '#1A1200' }]}>
                  {isConnecting ? 'PAIRING...' : 'CONNECT'}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: COLORS.bg, zIndex: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  subtitle: { fontFamily: FONT_MONO, fontSize: 10.5, color: COLORS.textDim, marginTop: 2 },
  cancel: { fontSize: 13, color: COLORS.textDim, padding: 6 },
  radarWrap: { alignItems: 'center', paddingTop: 28, paddingBottom: 8 },
  radar: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', borderWidth: 1, borderColor: COLORS.cyan },
  dot: { width: 40, height: 40, borderRadius: 20 },
  list: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8 },
  hint: { textAlign: 'center', fontSize: 12, color: COLORS.textDim, marginTop: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  brand: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  model: { fontSize: 12, color: COLORS.textDim, marginTop: 1 },
  protocol: { fontFamily: FONT_MONO, fontSize: 10, color: COLORS.textDim, marginTop: 4 },
  connectButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  connectText: { fontSize: 12, fontWeight: '700' },
});
