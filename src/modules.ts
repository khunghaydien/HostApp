export type ModuleId =
  | 'home'
  | 'profile'
  | 'setting'
  | 'interview'
  | 'library';

/** Footer tab order — labels come from i18n `tabs.*`. */
export const MODULES: ModuleId[] = [
  'home',
  'profile',
  'setting',
  'interview',
  'library',
];
