import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        padding: "40px",
                        textAlign: "center",
                        color: "#666",
                        fontFamily: "sans-serif",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "24px",
                            marginBottom: "16px",
                            color: "#333",
                        }}
                    >
                        Oops, something went wrong.
                    </h2>
                    <p style={{ marginBottom: "24px" }}>
                        We're working on getting this fixed as soon as we can.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: "10px 20px",
                            cursor: "pointer",
                            backgroundColor: "#0095f6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: "600",
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
