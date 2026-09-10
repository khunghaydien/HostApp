import type { ReactNode } from 'react';

import { useAuth } from './AuthProvider';

type Props = {
  children: ReactNode;
  fallback: ReactNode;
};

/**
 * Renders children only when a user exists in storage.
 * Otherwise shows `fallback` (typically LoginScreen).
 */
export function AuthGuard({ children, fallback }: Props) {
  const { user, ready } = useAuth();

  if (!ready) {
    return null;
  }

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
