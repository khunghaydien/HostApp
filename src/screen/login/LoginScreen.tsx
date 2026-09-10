import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLoginMutation } from '@/auth';
import { AppButton, AppScreen, useTheme, useToast } from '@/ui';

export function LoginScreen() {
  const { t } = useTranslation();
  const loginMutation = useLoginMutation();
  const { showError } = useToast();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      showError(t('auth.errorRequired'));
      return;
    }
    if (!trimmedEmail.includes('@')) {
      showError(t('auth.errorEmail'));
      return;
    }

    loginMutation.mutate({ email: trimmedEmail, password });
  };

  return (
    <AppScreen
      style={[
        styles.screen,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.form}
      >
        <Text style={styles.label}>{t('auth.email')}</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder={t('auth.emailPlaceholder')}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.label}>{t('auth.password')}</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder={t('auth.passwordPlaceholder')}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <AppButton
          label={t('auth.login')}
          onPress={onSubmit}
          disabled={loginMutation.isPending}
          style={styles.submit}
        />
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    screen: {
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    form: {
      gap: 8,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textMuted,
      marginTop: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      color: colors.text,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
    },
    submit: {
      marginTop: 20,
      alignSelf: 'stretch',
      minWidth: undefined,
    },
  });
}
