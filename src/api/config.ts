import { Platform } from 'react-native';

/**
 * API host. Android emulator cannot reach host via `localhost`.
 * Physical devices need your machine LAN IP instead.
 */
export const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
