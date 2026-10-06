import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught render error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5] p-6 text-center">
          <div className="max-w-md p-8 bg-white rounded-2xl shadow-xl border border-[#E9B8C7]/30">
            <span className="text-4xl mb-4 block">🌸</span>
            <h2 className="font-serif text-2xl font-bold text-[#4A234A] mb-2">
              WISHMINT Atelier
            </h2>
            <p className="text-sm text-[#6F6468] mb-6">
              A temporary display error occurred. Refreshing the page will restore your session.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-[#4A234A] text-white rounded-full text-sm font-semibold hover:bg-[#341534] transition-all cursor-pointer shadow-md"
            >
              Reload Website
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
