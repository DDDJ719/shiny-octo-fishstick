// TODO (Phase 3 of convoy-app-store-guide.md): once BleService starts making
// real react-native-ble-plx calls, request runtime permissions before
// scanning:
//   - Android 12+ (API 31+): BLUETOOTH_SCAN, BLUETOOTH_CONNECT via PermissionsAndroid
//   - Android <12: ACCESS_FINE_LOCATION
//   - iOS: NSBluetoothAlwaysUsageDescription in Info.plist (no runtime call needed)
// No-op today because scanning/connecting is mocked.
export async function ensureBlePermissions(): Promise<boolean> {
  return true;
}
