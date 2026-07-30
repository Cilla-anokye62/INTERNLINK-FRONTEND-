import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
  retryKey: number;
}

export default class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    error: null,
    retryKey: 0,
  };

  static getDerivedStateFromError(error: Error): Partial<AppErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // A production crash reporter can be connected here without changing screens.
  }

  private retry = () => {
    this.setState((state) => ({
      error: null,
      retryKey: state.retryKey + 1,
    }));
  };

  render() {
    if (!this.state.error) {
      return <View key={this.state.retryKey} style={styles.app}>{this.props.children}</View>;
    }

    return (
      <View style={styles.fallback} accessibilityRole="alert">
        <View style={styles.icon}>
          <Text style={styles.iconText}>!</Text>
        </View>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>
          InternLink could not display this screen. Try loading it again.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={this.retry}
          accessibilityRole="button"
          accessibilityLabel="Try loading InternLink again"
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#F6FBFC',
  },
  icon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    backgroundColor: '#FCE8E8',
  },
  iconText: {
    color: '#B42318',
    fontSize: 28,
    fontWeight: '800',
  },
  title: {
    color: '#063B46',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    color: '#54737A',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    minWidth: 150,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    marginTop: 22,
    paddingHorizontal: 24,
    backgroundColor: '#168C8A',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
