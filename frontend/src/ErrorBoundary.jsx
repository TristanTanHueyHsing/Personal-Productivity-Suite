import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
            // Reset the error state when resetKey changes
            this.setState({ hasError: false });
        }
    }

    componentDidCatch(error, errorInfo) {
        console.error("Markdown rendering error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            console.error("Error rendering markdown");
            return <div style={{ color: 'red' }}>⚠️ Error rendering markdown.</div>
        }

        return this.props.children;
    }
}

export default ErrorBoundary;