import type { ComponentType } from 'react';

export type MiniAppId = 'miniApp';

export type MiniAppConfig = {
  id: MiniAppId;
  title: string;
  description: string;
  /** Module Federation remote name (must match rspack remotes / MiniApp container name) */
  remote: string;
  /** Exposed module path on the remote (e.g. './App') */
  module: './App';
  /** Dev server port for this mini app */
  port: number;
  /** Lazy loader used by HostApp */
  load: () => Promise<{ default: ComponentType }>;
};

/**
 * Catalog of all mini apps HostApp can open.
 * Add a new entry here when you register a new remote in rspack.config.cjs.
 */
export const MINI_APPS: Record<MiniAppId, MiniAppConfig> = {
  miniApp: {
    id: 'miniApp',
    title: 'MiniApp',
    description: 'Federated remote on port 8086',
    remote: 'miniApp',
    module: './App',
    port: 8086,
    load: () => import('miniApp/App'),
  },
};

export const MINI_APP_LIST: MiniAppConfig[] = Object.values(MINI_APPS);
