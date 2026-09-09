export type ThemeMode = 'light' | 'dark';

export type AppColors = {
  primary: string;
  /** Single app background — applied to screens, shell, footer, etc. */
  background: string;
  text: string;
  textMuted: string;
  border: string;
  footerInactive: string;
  danger: string;
};

export const lightColors: AppColors = {
  primary: '#FF7A00',
  background: '#F5F6F8',
  text: '#123047',
  textMuted: '#3A5163',
  border: '#E5E5E5',
  footerInactive: '#000000',
  danger: '#D64545',
};

export const darkColors: AppColors = {
  primary: '#FF7A00',
  background: '#0F1419',
  text: '#F4F7FA',
  textMuted: '#9AA8B5',
  border: '#2A3441',
  footerInactive: '#C5D0DA',
  danger: '#FF6B6B',
};

export const palettes: Record<ThemeMode, AppColors> = {
  light: lightColors,
  dark: darkColors,
};

/** Default light palette — prefer useTheme().colors at runtime. */
export const colors = lightColors;
