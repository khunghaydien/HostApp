import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

import { AppQueryProvider } from '@/api';
import { AuthGuard, AuthProvider } from '@/auth';
import { loadSavedLanguage } from '@/i18n';
import { type ModuleId } from '@/modules';
import {
  HomeScreen,
  InterviewScreen,
  LibraryScreen,
  LoginScreen,
  ProfileScreen,
  SettingScreen,
} from '@/screen';
import {
  AppHeader,
  TabFooter,
  ThemeProvider,
  ToastProvider,
  useTheme,
} from '@/ui';

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider>
        <AppQueryProvider>
          <ToastProvider>
            <AuthProvider>
              <AppRoot />
            </AuthProvider>
          </ToastProvider>
        </AppQueryProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppRoot() {
  const { colors, mode } = useTheme();

  useEffect(() => {
    void loadSavedLanguage();
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: colors.background,
        },
      }),
    [colors.background],
  );

  return (
    <View style={styles.root}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <AuthGuard fallback={<LoginScreen />}>
        <AppShell />
      </AuthGuard>
    </View>
  );
}

function AppShell() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [activeId, setActiveId] = useState<ModuleId>('home');

  const styles = useMemo(
    () =>
      StyleSheet.create({
        content: {
          flex: 1,
          backgroundColor: colors.background,
        },
      }),
    [colors.background],
  );

  return (
    <>
      <AppHeader
        title={t(`${activeId}.title`)}
        onOpenSetting={() => setActiveId('setting')}
        onOpenProfile={() => setActiveId('profile')}
      />
      <View style={styles.content}>
        {activeId === 'home' ? <HomeScreen /> : null}
        {activeId === 'profile' ? <ProfileScreen /> : null}
        {activeId === 'setting' ? <SettingScreen /> : null}
        {activeId === 'interview' ? <InterviewScreen /> : null}
        {activeId === 'library' ? <LibraryScreen /> : null}
      </View>
      <TabFooter activeId={activeId} onSelect={setActiveId} />
    </>
  );
}
