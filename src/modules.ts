import type { ComponentType } from 'react';

import { BlankScreen } from '@/screens/BlankScreen';

export type ModuleId =
  | 'home'
  | 'profile'
  | 'settings'
  | 'interview'
  | 'library';

export type LocalModule = {
  id: ModuleId;
  title: string;
  kind: 'local';
};

export type RemoteModule = {
  id: ModuleId;
  title: string;
  kind: 'remote';
  remote: string;
  port: number;
  /** When false, Host shows a blank white screen and does not fetch the remote. */
  enabled: boolean;
  load: () => Promise<{ default: ComponentType }>;
};

export type AppModule = LocalModule | RemoteModule;

/**
 * App modules shown in the footer.
 * Home / Profile / Settings live in HostApp.
 * Interview / Library load via Module Federation when enabled.
 */
export const MODULES: AppModule[] = [
  { id: 'home', title: 'Home', kind: 'local' },
  { id: 'profile', title: 'Profile', kind: 'local' },
  { id: 'settings', title: 'Settings', kind: 'local' },
  {
    id: 'interview',
    title: 'Interview',
    kind: 'remote',
    remote: 'interview',
    port: 8084,
    enabled: false,
    load: () => Promise.resolve({ default: BlankScreen }),
  },
  {
    id: 'library',
    title: 'Library',
    kind: 'remote',
    remote: 'library',
    port: 8085,
    enabled: false,
    load: () => Promise.resolve({ default: BlankScreen }),
  },
];

export function getModule(id: ModuleId): AppModule {
  const mod = MODULES.find((item) => item.id === id);
  if (!mod) {
    throw new Error(`Unknown module: ${id}`);
  }
  return mod;
}
