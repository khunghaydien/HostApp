import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import {
  buildColors,
  DEFAULT_PRIMARY_ID,
  PRIMARY_PRESETS,
  type AppColors,
  type PrimaryId,
  type ThemeMode,
} from './colors';

const MODE_KEY = 'hostapp.themeMode';
const PRIMARY_KEY = 'hostapp.primaryId';

type ThemeContextValue = {
  mode: ThemeMode;
  primaryId: PrimaryId;
  colors: AppColors;
  setMode: (mode: ThemeMode) => void;
  setPrimaryId: (id: PrimaryId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isPrimaryId(value: string | null): value is PrimaryId {
  return PRIMARY_PRESETS.some((item) => item.id === value);
}

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(
    system === 'dark' ? 'dark' : 'light',
  );
  const [primaryId, setPrimaryIdState] =
    useState<PrimaryId>(DEFAULT_PRIMARY_ID);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [savedMode, savedPrimary] = await Promise.all([
          AsyncStorage.getItem(MODE_KEY),
          AsyncStorage.getItem(PRIMARY_KEY),
        ]);
        if (!cancelled && (savedMode === 'light' || savedMode === 'dark')) {
          setModeState(savedMode);
        }
        if (!cancelled && isPrimaryId(savedPrimary)) {
          setPrimaryIdState(savedPrimary);
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    void AsyncStorage.setItem(MODE_KEY, next);
  }, []);

  const setPrimaryId = useCallback((id: PrimaryId) => {
    setPrimaryIdState(id);
    void AsyncStorage.setItem(PRIMARY_KEY, id);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      primaryId,
      colors: buildColors(mode, primaryId),
      setMode,
      setPrimaryId,
    }),
    [mode, primaryId, setMode, setPrimaryId],
  );

  if (!ready) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
