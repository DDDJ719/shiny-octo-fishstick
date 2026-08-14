// Mock BLE driver layer.
//
// This mirrors the timing/shape of real react-native-ble-plx calls
// (scanForPeripherals / connect / writeCharacteristicWithResponse) without
// touching actual hardware, because no manufacturer protocol has been
// reverse-engineered yet (that's Phase 2 in convoy-app-store-guide.md).
//
// Swap-in plan per brand, once you have captured its byte format:
//   1. Implement a real `LightDriver` for that brand in ble/drivers/<brand>.ts
//      using react-native-ble-plx (scan by service UUID, connect, write the
//      captured byte sequence for power/color/brightness/pattern).
//   2. Register it in DRIVER_REGISTRY below, keyed by brand name.
//   3. Brands without a registered real driver keep using MockDriver, so you
//      can ship support incrementally, brand by brand.
//
// Everything above this file (screens, App.tsx) only calls the BleService
// functions below — it never touches ble-plx directly — so this file is the
// single place that changes as real drivers come online.

import { DiscoverableLight, LightDevice } from '../data/data';

export type SyncCommand = {
  color: string;
  pattern: string;
  brightness: number;
};

export type SyncResult = {
  deviceId: string;
  ok: boolean;
  elapsedMs: number;
};

export interface LightDriver {
  /** Simulates the manufacturer-specific handshake + write. Resolves once applied. */
  sync(device: LightDevice, command: SyncCommand): Promise<SyncResult>;
}

class MockDriver implements LightDriver {
  async sync(device: LightDevice, _command: SyncCommand): Promise<SyncResult> {
    const start = Date.now();
    // Simulated handshake latency, roughly matching the web prototype's feel.
    await delay(300 + Math.random() * 150);
    return { deviceId: device.id, ok: true, elapsedMs: Date.now() - start };
  }
}

// Real per-brand drivers get registered here as Phase 2 research completes.
// e.g. DRIVER_REGISTRY['MICTUNING'] = new MictuningBleDriver();
const DRIVER_REGISTRY: Record<string, LightDriver> = {};
const mockDriver = new MockDriver();

function driverFor(device: LightDevice): LightDriver {
  return DRIVER_REGISTRY[device.brand] ?? mockDriver;
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}

/**
 * Scans for nearby lights not already paired. In the mock, "discovers" the
 * fixed DISCOVERABLE_POOL over a few seconds. The real implementation will
 * call BleManager.startDeviceScan and filter by each driver's service UUID.
 */
export function scanForLights(
  pool: DiscoverableLight[],
  alreadyPaired: Set<string>,
  onFound: (item: DiscoverableLight) => void,
  onDone: () => void,
) {
  const candidates = pool.filter((p) => !alreadyPaired.has(`${p.brand}-${p.model}`));
  const timers: ReturnType<typeof setTimeout>[] = [];
  candidates.forEach((item, i) => {
    timers.push(setTimeout(() => onFound(item), 500 + i * 550));
  });
  timers.push(setTimeout(onDone, 500 + candidates.length * 550 + 300));
  return () => timers.forEach(clearTimeout);
}

/**
 * Connects to a discovered light. Real implementation: BleManager.connectToDevice
 * followed by discoverAllServicesAndCharacteristics, then the brand driver's
 * init sequence.
 */
export async function connectToLight(_item: DiscoverableLight): Promise<void> {
  await delay(900);
}

/**
 * Applies one command to a group of devices, one at a time, calling back as
 * each device's handshake completes so the UI can show live per-zone status.
 */
export async function syncGroup(
  devices: LightDevice[],
  command: SyncCommand,
  onDeviceStart: (device: LightDevice) => void,
  onDeviceDone: (device: LightDevice, result: SyncResult) => void,
) {
  for (const device of devices) {
    onDeviceStart(device);
    const result = await driverFor(device).sync(device, command);
    onDeviceDone(device, result);
  }
}
