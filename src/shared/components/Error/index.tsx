import { Component, ReactNode, ErrorInfo } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error('ErrorBoundary caught an error', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-2" style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Something went wrong.</h1>
            {this.state.error?.message && <p style={{ color: 'gray' }}>{this.state.error.message}</p>}
            <button onClick={this.handleRetry} style={{ marginTop: '1rem' }}>
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
