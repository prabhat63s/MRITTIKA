import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
            <h1 className="text-6xl font-extrabold text-orange-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-6">Oops! Page Not Found</h2>
            <p className="mb-6 text-gray-700 max-w-md">
                The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                to="/"
                className="inline-block bg-orange-600 text-white px-6 py-3 rounded font-semibold hover:bg-orange-700 transition"
            >
                Go to Homepage
            </Link>
        </div>
    );
}
