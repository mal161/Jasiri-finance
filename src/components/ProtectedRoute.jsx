import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../firebase/Firebase';

function ProtectedRoute({ element, requireAuth = true }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    if (loading) {
        return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
            <div className="inline-block">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading....</p>
            </div>
        </div>
        );
    }

    // If requireAuth is true (default), redirect to signin if not authenticated
    if (requireAuth) {
        return isAuthenticated ? element : <Navigate to="/signin" />;
    }

    // If requireAuth is false (for auth pages), redirect to dashboard if already authenticated
    return isAuthenticated ? <Navigate to="/dashboard" /> : element;
}

export default ProtectedRoute;
