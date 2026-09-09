import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import { FederatedModule } from '@/federation/FederatedModule';
import '@/i18n';
import { loadSavedLanguage } from '@/i18n';
import { getModule, type ModuleId } from '@/modules';
import { BlankScreen } from '@/screens/BlankScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { Footer } from '@/shell/Footer';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

/**
 * Root shell: SafeAreaProvider + theme + i18n so every tab stays clear of
 * system chrome and respects appearance / language settings.
 */
export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const { colors } = useTheme();
  const [activeId, setActiveId] = useState<ModuleId>('home');
  const active = getModule(activeId);

  useEffect(() => {
    void loadSavedLanguage();
  }, []);

  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'right', 'bottom', 'left']}>
      <View style={styles.content}>
        {activeId === 'home' ? <HomeScreen /> : null}
        {activeId === 'profile' ? <ProfileScreen /> : null}
        {activeId === 'settings' ? <SettingsScreen /> : null}
        {active.kind === 'remote' ? (
          active.enabled ? (
            <FederatedModule key={active.id} module={active} />
          ) : (
            <BlankScreen />
          )
        ) : null}
      </View>
      <Footer activeId={activeId} onSelect={setActiveId} />
    </SafeAreaView>
  );
}
