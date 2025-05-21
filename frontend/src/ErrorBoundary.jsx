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

    componentDidCatch(error, errorInfo) {
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;