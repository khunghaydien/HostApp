import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  children: ReactNode;
  onRetry: () => void;
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
    console.error('MiniApp failed to load', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.box}>
          <Text style={styles.title}>MiniApp unavailable</Text>
          <Text style={styles.message}>
            Start MiniApp with yarn start:mf (port 8086), then retry.
          </Text>
          <Pressable
            onPress={() => {
              this.setState({ error: null });
              this.props.onRetry();
            }}
            style={styles.retry}
          >
            <Text style={styles.retryLabel}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#123047',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: '#3A5163',
    textAlign: 'center',
  },
  retry: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#0F6E56',
  },
  retryLabel: {
    color: '#F4FBFF',
    fontWeight: '700',
  },
});
