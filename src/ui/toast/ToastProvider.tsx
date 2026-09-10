import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../theme';
import { bindToastHandler } from './toastBridge';

export type ToastType = 'success' | 'error';

type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  showToast: (type: ToastType, message: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_MS = 2800;

type Props = {
  children: ReactNode;
};

export function ToastProvider({ children }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [toast, setToast] = useState<ToastItem | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);
  const insets = useSafeAreaInsets();

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setToast(null);
      }
    });
  }, [opacity, translateY]);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const trimmed = message.trim();
      if (!trimmed) {
        return;
      }

      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }

      idRef.current += 1;
      setToast({ id: idRef.current, type, message: trimmed });
      opacity.setValue(0);
      translateY.setValue(-8);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      hideTimer.current = setTimeout(() => {
        hide();
      }, TOAST_MS);
    },
    [hide, opacity, translateY],
  );

  useEffect(() => {
    bindToastHandler(showToast);
    return () => bindToastHandler(null);
  }, [showToast]);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      showSuccess: (message) => showToast('success', message),
      showError: (message) => showToast('error', message),
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.host,
            {
              top: insets.top + 8,
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <Pressable
            onPress={hide}
            style={styles.toast}
            accessibilityRole="alert"
          >
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                styles.glass,
                toast.type === 'success' ? styles.success : styles.error,
              ]}
            />
            <Text style={styles.message}>{toast.message}</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    host: {
      position: 'absolute',
      left: 16,
      right: 16,
      zIndex: 1000,
      elevation: 1000,
    },
    toast: {
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 14,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: colors.onPrimary,
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    glass: {
      opacity: 0.55,
    },
    success: {
      backgroundColor: colors.success,
    },
    error: {
      backgroundColor: colors.danger,
    },
    message: {
      color: colors.onPrimary,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
}
