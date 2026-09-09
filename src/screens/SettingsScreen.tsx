import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  setAppLanguage,
  type AppLanguage,
} from '@/i18n';
import { useTheme } from '@/theme/ThemeProvider';

export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { colors, mode, setMode } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const language = (i18n.language?.startsWith('vi') ? 'vi' : 'en') as AppLanguage;

  return (
    <View style={styles.screen}>
      <Text style={styles.headline}>{t('settings.title')}</Text>

      <Text style={styles.section}>{t('settings.appearance')}</Text>
      <View style={styles.row}>
        <OptionChip
          label={t('settings.light')}
          active={mode === 'light'}
          onPress={() => setMode('light')}
        />
        <OptionChip
          label={t('settings.dark')}
          active={mode === 'dark'}
          onPress={() => setMode('dark')}
        />
      </View>

      <Text style={styles.section}>{t('settings.languageSection')}</Text>
      <View style={styles.row}>
        <OptionChip
          label={t('settings.vietnamese')}
          active={language === 'vi'}
          onPress={() => void setAppLanguage('vi')}
        />
        <OptionChip
          label={t('settings.english')}
          active={language === 'en'}
          onPress={() => void setAppLanguage('en')}
        />
      </View>
    </View>
  );
}

function OptionChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
        {label}
      </Text>
    </Pressable>
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
      marginBottom: 28,
    },
    section: {
      fontSize: 13,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      fontWeight: '700',
      color: colors.textMuted,
      marginBottom: 12,
      marginTop: 8,
    },
    row: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 24,
    },
    chip: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      minWidth: 110,
      alignItems: 'center',
    },
    chipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    chipLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    chipLabelActive: {
      color: '#FFFFFF',
    },
  });
}
