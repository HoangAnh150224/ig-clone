import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-500"></div>
        </div>
    );
};

export default LoadingSpinner;
