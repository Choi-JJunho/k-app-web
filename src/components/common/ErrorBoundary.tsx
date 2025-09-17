import React from 'react';

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error | null;
    errorInfo: ErrorInfo | null;
    retry: () => void;
  }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

const DefaultErrorFallback: React.FC<{
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retry: () => void;
}> = ({ error, retry }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="text-6xl mb-6">⚠️</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        앱에 문제가 발생했습니다
      </h1>
      <p className="text-gray-600 mb-6">
        예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      {error && (
        <details className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
            오류 상세 정보
          </summary>
          <pre className="text-xs text-gray-600 overflow-auto max-h-32">
            {error.message}
            {error.stack}
          </pre>
        </details>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={retry}
          className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
        >
          다시 시도
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          페이지 새로고침
        </button>
      </div>
    </div>
  </div>
);

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo: {
        componentStack: errorInfo.componentStack,
        errorBoundary: errorInfo.errorBoundary,
      },
    });

    // 에러 로깅
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // 외부 에러 핸들러 호출
    if (this.props.onError) {
      this.props.onError(error, {
        componentStack: errorInfo.componentStack,
        errorBoundary: errorInfo.errorBoundary,
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

// 함수형 컴포넌트용 래퍼
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;