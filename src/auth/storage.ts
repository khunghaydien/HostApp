import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AuthSession } from './types';

const SESSION_KEY = 'hostapp.auth.session';

/** In-memory mirror so apiRequest can read the token without React. */
let cachedSession: AuthSession | null = null;

export function getAccessToken(): string | null {
  return cachedSession?.accessToken ?? null;
}

export async function loadSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) {
    cachedSession = null;
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (
      parsed?.user?.id &&
      parsed?.user?.email &&
      parsed?.accessToken &&
      parsed?.refreshToken
    ) {
      cachedSession = parsed;
      return parsed;
    }
  } catch {
    // Corrupt payload.
  }

  await AsyncStorage.removeItem(SESSION_KEY);
  cachedSession = null;
  return null;
}

export async function saveSession(session: AuthSession): Promise<void> {
  cachedSession = session;
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  cachedSession = null;
  await AsyncStorage.removeItem(SESSION_KEY);
}
