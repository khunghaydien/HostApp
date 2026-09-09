import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';

export function HomeScreen() {
  const { t } = useTranslation();
  const { colors, mode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.screen}>
      <Text style={styles.headline}>{t('home.title')}</Text>
      <Text style={styles.support}>{t('home.subtitle')}</Text>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 24,
      paddingTop: 28,
    },
    headline: {
      fontSize: 34,
      fontWeight: '700',
      color: colors.text,
    },
    support: {
      marginTop: 8,
      fontSize: 16,
      lineHeight: 22,
      color: colors.textMuted,
    },
  });
}
