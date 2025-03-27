import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    errorMessage: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state = { hasError: false, errorMessage: '' };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, errorMessage: error.message };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("Error caught in ErrorBoundary:", error, info);
    }

    handleRetry = () => {
        this.setState({ hasError: false, errorMessage: '' });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h2>Something went wrong: {this.state.errorMessage}</h2>
                    <button onClick={this.handleRetry}>Retry</button>
                </div>
            );
        }

        return this.props.children; // Renders the wrapped children
    }
}

export default ErrorBoundary;
