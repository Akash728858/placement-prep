import { Component } from 'react';
import { Link } from 'react-router-dom';

export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Something went wrong</h2>
          <p className="text-slate-600 text-sm">This page could not be loaded. Try going back to the dashboard.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white bg-primary hover:opacity-90"
          >
            Go to Dashboard
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
