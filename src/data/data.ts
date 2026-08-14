export type LightDevice = {
  id: string;
  brand: string;
  protocol: string;
  zone: string;
  model: string;
  connected: boolean;
  signal: number | null;
  color: string;
  on: boolean;
  selected: boolean;
};

export type DiscoverableLight = {
  brand: string;
  protocol: string;
  model: string;
  rssi: number;
};

export type Scene = {
  name: string;
  desc: string;
  color: string;
  pattern: string;
  brightness: number;
};

export type LogEntry = {
  text: string;
  kind: 'info' | 'pending' | 'ok';
};

export type OnboardStep = {
  title: string;
  body: string;
  icon: 'pair' | 'rig' | 'select' | 'dial' | 'sync' | 'scenes';
};

export const PATTERNS = ['Solid', 'Chase', 'Strobe', 'Fade', 'Rainbow'];

export const SWATCHES = [
  '#FFB020', '#E1483A', '#2FBF8F', '#45C6E0',
  '#7B61FF', '#FF5C9E', '#FFFFFF', '#4D6BFF',
];

export const SCENES: Scene[] = [
  { name: 'Trailhead', desc: 'Warm amber, low glow', color: '#FFB020', pattern: 'Solid', brightness: 45 },
  { name: 'Night Crawl', desc: 'Dim red, preserves vision', color: '#E1483A', pattern: 'Solid', brightness: 20 },
  { name: 'Show Stopper', desc: 'Full rainbow chase, max output', color: '#7B61FF', pattern: 'Rainbow', brightness: 100 },
  { name: 'All Off', desc: 'Kill every zone at once', color: '#8B939B', pattern: 'Solid', brightness: 0 },
];

export const INITIAL_DEVICES: LightDevice[] = [
  { id: 'd1', brand: 'MICTUNING', protocol: 'MIC-BLE v2', zone: 'Rock Lights — Front', model: 'RGBW Rock Kit', connected: true, signal: -52, color: '#FFB020', on: true, selected: true },
  { id: 'd2', brand: 'ORACLE Lighting', protocol: 'ColorSHIFT RF/BLE', zone: 'Grille Halo', model: 'ColorSHIFT Halo', connected: true, signal: -61, color: '#2FBF8F', on: true, selected: true },
  { id: 'd3', brand: 'Xprite', protocol: 'XP-Mesh v1.3', zone: 'Underglow', model: 'Journey Series', connected: true, signal: -70, color: '#45C6E0', on: false, selected: true },
  { id: 'd4', brand: 'KC HiLiTES', protocol: 'FLEX-BT', zone: 'Rock Lights — Rear', model: 'FLEX Era 3', connected: false, signal: null, color: '#8B939B', on: false, selected: false },
  { id: 'd5', brand: 'MICTUNING', protocol: 'MIC-BLE v2', zone: 'Interior Cab', model: 'Weatherproof Strip', connected: true, signal: -45, color: '#FFB020', on: true, selected: true },
];

export const DISCOVERABLE_POOL: DiscoverableLight[] = [
  { brand: 'Rugged Ridge', protocol: 'RR-Connect', model: 'Spectrum Rock Light', rssi: -58 },
  { brand: 'T-REX Lighting', protocol: 'TREX-BLE', model: 'Torch Grille Kit', rssi: -66 },
  { brand: 'Xprite', protocol: 'XP-Mesh v1.3', model: 'Tailgate Bar', rssi: -74 },
  { brand: 'ORACLE Lighting', protocol: 'ColorSHIFT RF/BLE', model: 'Fender Well Kit', rssi: -63 },
];

export const ONBOARDING_STEPS: OnboardStep[] = [
  {
    title: 'Pair your lights',
    body: "Tap + ADD on the Rig tab to scan for nearby Bluetooth controllers. Each result shows its brand, model, and signal strength. Tap Connect to pair it — no matter which manufacturer's protocol it speaks.",
    icon: 'pair',
  },
  {
    title: 'Check zone status',
    body: 'The Rig tab lists every paired light as a zone, with its brand, model, and live signal bars. Each zone has its own on/off toggle for a quick spot-check.',
    icon: 'rig',
  },
  {
    title: 'Select zones for the group',
    body: 'On the Convoy tab, tap a zone\'s chip to include it — or use Select all to grab everything connected. Only the outlined chips receive the next command.',
    icon: 'select',
  },
  {
    title: 'Set color, pattern, brightness',
    body: 'Pick a color, choose a pattern, and drag the gauge dial for brightness. These settings apply to the whole selected group at once, not one light at a time.',
    icon: 'dial',
  },
  {
    title: 'Sync to Convoy',
    body: 'Tap SYNC TO CONVOY. Each zone handshakes in on its own protocol — watch it happen live in the console log — then updates together.',
    icon: 'sync',
  },
  {
    title: 'Save and reuse scenes',
    body: 'The Scenes tab holds one-tap presets like Trailhead or Night Crawl. Tapping one selects the right zones and syncs them instantly.',
    icon: 'scenes',
  },
];
