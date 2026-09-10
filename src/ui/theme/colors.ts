export type ThemeMode = 'light' | 'dark';

export type PrimaryId = 'orange' | 'blue' | 'green' | 'purple' | 'red';

export type AppColors = {
  primary: string;
  /** Text / icon on primary surfaces. */
  onPrimary: string;
  /** Single app background — applied to screens, footer, etc. */
  background: string;
  text: string;
  textMuted: string;
  border: string;
  footerInactive: string;
  /** Success surfaces (e.g. toast). */
  success: string;
  danger: string;
};

/** Five common brand primary colors. */
export const PRIMARY_PRESETS: {
  id: PrimaryId;
  hex: string;
  labelKey: string;
}[] = [
  { id: 'orange', hex: '#FF7A00', labelKey: 'setting.primaryOrange' },
  { id: 'blue', hex: '#2563EB', labelKey: 'setting.primaryBlue' },
  { id: 'green', hex: '#16A34A', labelKey: 'setting.primaryGreen' },
  { id: 'purple', hex: '#7C3AED', labelKey: 'setting.primaryPurple' },
  { id: 'red', hex: '#E11D48', labelKey: 'setting.primaryRed' },
];

export const DEFAULT_PRIMARY_ID: PrimaryId = 'orange';

export function getPrimaryHex(id: PrimaryId): string {
  return (
    PRIMARY_PRESETS.find((item) => item.id === id)?.hex ??
    PRIMARY_PRESETS[0].hex
  );
}

export const lightColors: Omit<AppColors, 'primary' | 'onPrimary'> = {
  background: '#F5F6F8',
  text: '#123047',
  textMuted: '#3A5163',
  border: '#E5E5E5',
  footerInactive: '#000000',
  success: '#16A34A',
  danger: '#D64545',
};

export const darkColors: Omit<AppColors, 'primary' | 'onPrimary'> = {
  background: '#0F1419',
  text: '#F4F7FA',
  textMuted: '#9AA8B5',
  border: '#2A3441',
  footerInactive: '#C5D0DA',
  success: '#22C55E',
  danger: '#FF6B6B',
};

export const basePalettes: Record<
  ThemeMode,
  Omit<AppColors, 'primary' | 'onPrimary'>
> = {
  light: lightColors,
  dark: darkColors,
};

export function buildColors(mode: ThemeMode, primaryId: PrimaryId): AppColors {
  return {
    ...basePalettes[mode],
    primary: getPrimaryHex(primaryId),
    onPrimary: '#FFFFFF',
  };
}
