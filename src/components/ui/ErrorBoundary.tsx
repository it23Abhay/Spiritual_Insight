'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 text-6xl">🙏</div>
          <h2 className="text-xl font-bold text-deep-blue mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 mb-6">
            We encountered an unexpected issue. Please refresh the page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="rounded-full gradient-spiritual px-6 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-6 rounded-xl bg-red-50 p-4 text-left text-xs text-red-700 max-w-md overflow-auto">
              {this.state.error.message}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
