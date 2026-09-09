import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { MODULES, type ModuleId } from '@/modules';
import { useTheme } from '@/theme/ThemeProvider';
import { ModuleIcon } from './ModuleIcon';

type Props = {
  activeId: ModuleId;
  onSelect: (id: ModuleId) => void;
};

export function Footer({ activeId, onSelect }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.footer}>
      {MODULES.map((mod) => {
        const active = mod.id === activeId;
        const tint = active ? colors.primary : colors.footerInactive;

        return (
          <Pressable
            key={mod.id}
            onPress={() => onSelect(mod.id)}
            style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={t(`tabs.${mod.id}`)}
          >
            <ModuleIcon moduleId={mod.id} color={tint} />
            <Text style={[styles.label, { color: tint }]}>
              {t(`tabs.${mod.id}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    footer: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
      paddingTop: 8,
      paddingBottom: 8,
    },
    item: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
      paddingVertical: 4,
    },
    pressed: {
      opacity: 0.6,
    },
    label: {
      fontSize: 11,
      fontWeight: '600',
    },
  });
}
