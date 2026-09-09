import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

/** Placeholder until a module / mini app is implemented. */
export function BlankScreen() {
  const { colors } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        blank: {
          flex: 1,
          backgroundColor: colors.background,
        },
      }),
    [colors],
  );

  return <View style={styles.blank} />;
}
