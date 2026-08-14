import React, { useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_MONO } from './src/theme/theme';
import {
  DISCOVERABLE_POOL,
  DiscoverableLight,
  INITIAL_DEVICES,
  LightDevice,
  LogEntry,
  Scene,
} from './src/data/data';
import { hexToRgb } from './src/utils/color';
import { connectToLight, scanForLights, syncGroup } from './src/ble/BleService';
import { ensureBlePermissions } from './src/ble/permissions';
import RigScreen from './src/screens/RigScreen';
import ConvoyScreen from './src/screens/ConvoyScreen';
import ScenesScreen from './src/screens/ScenesScreen';
import OnboardingOverlay from './src/screens/OnboardingOverlay';
import ScanOverlay from './src/screens/ScanOverlay';

type Tab = 'rig' | 'convoy' | 'scenes';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <ConvoyControlApp />
    </SafeAreaProvider>
  );
}

function ConvoyControlApp() {
  const [tab, setTab] = useState<Tab>('convoy');
  const [devices, setDevices] = useState<LightDevice[]>(INITIAL_DEVICES);
  const [masterColor, setMasterColor] = useState('#FFB020');
  const [masterPattern, setMasterPattern] = useState('Solid');
  const [brightness, setBrightness] = useState(70);
  const [syncing, setSyncing] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [syncedIds, setSyncedIds] = useState<Record<string, boolean>>({});

  const [scanOpen, setScanOpen] = useState(false);
  const [scanPhase, setScanPhase] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [discovered, setDiscovered] = useState<DiscoverableLight[]>([]);
  const [connectingKey, setConnectingKey] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const scanCancelRef = useRef<(() => void) | null>(null);

  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardStep, setOnboardStep] = useState(0);

  const connectedDevices = devices.filter((d) => d.connected);
  const selectedDevices = connectedDevices.filter((d) => d.selected);

  const toggleSelect = (id: string) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, selected: !d.selected } : d)));
  };

  const toggleSelectAll = () => {
    const allSelected = selectedDevices.length === connectedDevices.length && connectedDevices.length > 0;
    setDevices((prev) => prev.map((d) => (d.connected ? { ...d, selected: !allSelected } : d)));
  };

  const toggleOn = (id: string) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, on: !d.on } : d)));
  };

  const runSync = async (color = masterColor, pattern = masterPattern, level = brightness) => {
    const targets = devices.filter((d) => d.connected && d.selected);
    if (targets.length === 0) return;
    setSyncing(true);
    setSyncedIds({});
    setLog([
      {
        text: `> broadcasting ${pattern.toLowerCase()} @ ${level}% to ${targets.length} zone${targets.length > 1 ? 's' : ''}`,
        kind: 'info',
      },
    ]);

    await syncGroup(
      targets,
      { color, pattern, brightness: level },
      (device) => {
        setLog((prev) => [...prev, { text: `> ${device.brand} · ${device.protocol} handshake...`, kind: 'pending' }]);
      },
      (device, result) => {
        const [r, g, b] = hexToRgb(color);
        setDevices((prev) => prev.map((d) => (d.id === device.id ? { ...d, color, on: level > 0 } : d)));
        setSyncedIds((prev) => ({ ...prev, [device.id]: true }));
        setLog((prev) => [
          ...prev,
          { text: `  ${device.zone} — synced rgb(${r},${g},${b}) [${result.elapsedMs}ms]`, kind: 'ok' },
        ]);
      },
    );

    setSyncing(false);
  };

  const applyScene = (scene: Scene) => {
    setMasterColor(scene.color);
    setMasterPattern(scene.pattern);
    setBrightness(scene.brightness);
    setDevices((prev) => prev.map((d) => (d.connected ? { ...d, selected: true } : d)));
    setTab('convoy');
    setTimeout(() => runSync(scene.color, scene.pattern, scene.brightness), 250);
  };

  const openScan = async () => {
    await ensureBlePermissions();
    setScanOpen(true);
    setScanPhase('scanning');
    setDiscovered([]);
    const pairedKeys = new Set(devices.map((d) => `${d.brand}-${d.model}`));
    scanCancelRef.current = scanForLights(
      DISCOVERABLE_POOL,
      pairedKeys,
      (item) => setDiscovered((prev) => [...prev, item]),
      () => setScanPhase('done'),
    );
  };

  const closeScan = () => {
    scanCancelRef.current?.();
    setScanOpen(false);
    setScanPhase('idle');
    setConnectingKey(null);
  };

  const connectDiscovered = async (item: DiscoverableLight) => {
    const key = `${item.brand}-${item.model}`;
    setConnectingKey(key);
    await connectToLight(item);
    const newId = `d${Date.now()}`;
    const newDevice: LightDevice = {
      id: newId,
      brand: item.brand,
      protocol: item.protocol,
      zone: item.model,
      model: item.model,
      connected: true,
      signal: item.rssi,
      color: '#FFB020',
      on: false,
      selected: true,
    };
    setDevices((prev) => [...prev, newDevice]);
    setDiscovered((prev) => prev.filter((d) => `${d.brand}-${d.model}` !== key));
    setConnectingKey(null);
    setJustAddedId(newId);
    closeScan();
    setTab('rig');
    setTimeout(() => setJustAddedId(null), 2000);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.statusBar}>
        <View style={styles.statusRow}>
          <View>
            <Text style={styles.logo}>CONVOY</Text>
            <Text style={styles.tagline}>Universal RGB control</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={styles.statusRight}>
              <Pressable
                onPress={() => {
                  setOnboardStep(0);
                  setShowOnboarding(true);
                }}
                style={styles.helpButton}
              >
                <Text style={styles.helpButtonText}>?</Text>
              </Pressable>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>
                  {connectedDevices.length}/{devices.length} online
                </Text>
              </View>
            </View>
            <Text style={styles.manufacturers}>4 manufacturers</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {tab === 'rig' && (
          <RigScreen devices={devices} justAddedId={justAddedId} onOpenScan={openScan} onToggleOn={toggleOn} />
        )}
        {tab === 'convoy' && (
          <ConvoyScreen
            brightness={brightness}
            setBrightness={setBrightness}
            connectedDevices={connectedDevices}
            selectedDevices={selectedDevices}
            toggleSelect={toggleSelect}
            toggleSelectAll={toggleSelectAll}
            masterColor={masterColor}
            setMasterColor={setMasterColor}
            masterPattern={masterPattern}
            setMasterPattern={setMasterPattern}
            syncing={syncing}
            syncedIds={syncedIds}
            log={log}
            onSync={() => runSync()}
          />
        )}
        {tab === 'scenes' && <ScenesScreen onApplyScene={applyScene} />}
      </ScrollView>

      {showOnboarding && (
        <OnboardingOverlay step={onboardStep} setStep={setOnboardStep} onClose={() => setShowOnboarding(false)} />
      )}

      {scanOpen && (
        <ScanOverlay
          scanPhase={scanPhase}
          discovered={discovered}
          connectingKey={connectingKey}
          onClose={closeScan}
          onConnect={connectDiscovered}
        />
      )}

      <View style={styles.bottomNav}>
        {(
          [
            { id: 'rig', label: 'Rig' },
            { id: 'convoy', label: 'Convoy' },
            { id: 'scenes', label: 'Scenes' },
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setTab(t.id)}
            style={[styles.navItem, { borderTopColor: tab === t.id ? COLORS.amber : 'transparent' }]}
          >
            <Text style={[styles.navLabel, { color: tab === t.id ? COLORS.amber : COLORS.textDim }]}>
              {t.label.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  statusBar: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 20, fontWeight: '700', color: COLORS.text, letterSpacing: 0.5 },
  tagline: { fontSize: 11, color: COLORS.textDim, marginTop: -2 },
  statusRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  helpButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButtonText: { fontSize: 12, fontWeight: '700', color: COLORS.textDim },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: COLORS.teal },
  onlineText: { fontFamily: FONT_MONO, fontSize: 12, color: COLORS.teal },
  manufacturers: { fontFamily: FONT_MONO, fontSize: 10, color: COLORS.textDim, marginTop: 3 },
  body: { flex: 1 },
  bodyContent: { padding: 20 },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.line, backgroundColor: COLORS.panel },
  navItem: { flex: 1, alignItems: 'center', paddingTop: 14, paddingBottom: 16, borderTopWidth: 2 },
  navLabel: { fontSize: 13, fontWeight: '600', letterSpacing: 1 },
});
