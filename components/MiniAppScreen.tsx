import { lazy, Suspense, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { MiniAppConfig } from '../miniApps';
import { ErrorBoundary } from './ErrorBoundary';

type Props = {
  miniApp: MiniAppConfig;
  onClose: () => void;
};

export function MiniAppScreen({ miniApp, onClose }: Props) {
  const [loadKey, setLoadKey] = useState(0);
  const RemoteApp = useMemo(
    () => lazy(miniApp.load),
    [miniApp, loadKey],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={12}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{miniApp.title}</Text>
        <View style={styles.side} />
      </View>

      <ErrorBoundary
        key={loadKey}
        onRetry={() => setLoadKey((key) => key + 1)}
      >
        <Suspense
          fallback={
            <View style={styles.loading}>
              <ActivityIndicator color="#0F6E56" />
              <Text style={styles.loadingLabel}>
                Downloading {miniApp.title} bundle…
              </Text>
            </View>
          }
        >
          <RemoteApp />
        </Suspense>
      </ErrorBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#E8F1F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C5D4DC',
  },
  back: {
    color: '#0F6E56',
    fontSize: 16,
    fontWeight: '600',
    width: 64,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#123047',
  },
  side: {
    width: 64,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingLabel: {
    color: '#3A5163',
    fontSize: 15,
  },
});
