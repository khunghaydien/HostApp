import { lazy, Suspense, useMemo, useState, type ComponentType } from 'react';

import type { RemoteModule } from '@/modules';
import { BlankScreen } from '@/screens/BlankScreen';
import { ErrorBoundary } from './ErrorBoundary';

type Props = {
  module: RemoteModule;
};

/**
 * Loads a federated mini app. Missing/failing remotes fall back to a blank
 * white screen instead of an error UI.
 */
export function FederatedModule({ module }: Props) {
  const [loadKey, setLoadKey] = useState(0);

  const RemoteApp = useMemo(() => {
    const load = (): Promise<{ default: ComponentType }> =>
      module.load().catch((error) => {
        console.warn(`[${module.id}] remote unavailable, showing blank`, error);
        return { default: BlankScreen };
      });

    return lazy(load);
  }, [module, loadKey]);

  return (
    <ErrorBoundary
      key={loadKey}
      fallback={<BlankScreen />}
      onRetry={() => setLoadKey((key) => key + 1)}
    >
      <Suspense fallback={<BlankScreen />}>
        <RemoteApp />
      </Suspense>
    </ErrorBoundary>
  );
}
