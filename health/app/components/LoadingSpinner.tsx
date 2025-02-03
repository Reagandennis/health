import React from "react";

export default function LoadingSpinner() {
    return (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto"></div>
                <p className="text-gray-700 mt-4">Processing your application...</p>
                <p className="text-gray-500 text-sm mt-2">Please wait while we redirect you.</p>
            </div>
        </div>
    );
}
