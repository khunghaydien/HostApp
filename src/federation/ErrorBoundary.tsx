import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onRetry: () => void;
  /** When set, render this instead of crashing / showing an error screen. */
  fallback?: ReactNode;
};

type State = {
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Federated module failed to load', error, info);
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}
