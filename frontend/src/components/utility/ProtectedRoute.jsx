import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../lib/context';
import { useEffect, useState } from 'react';
import Loading from './Loading';

export default function ProtectedRoute({ children }) {
    const context = useAppContext();
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isContextInitialized, setIsContextInitialized] = useState(false);
    
    // First check if context is initialized
    useEffect(() => {
        // Check for explicit initialization flag in context
        if (context.isInitialized !== undefined) {
            setIsContextInitialized(context.isInitialized);
            console.log("ProtectedRoute: Context initialization state:", context.isInitialized);
        } else {
            // Fallback: Check if we have both loaded the initialization complete message
            // and if we have auth data in the context
            const isInitialized = 
                (!context.isInitializing) || // Check if initialization is explicitly complete
                (context.authToken && context.user); // Or if we have valid auth data
                
            setIsContextInitialized(isInitialized);
            console.log("ProtectedRoute: Inferred context initialization state:", isInitialized);
        }
    }, [context.isInitialized, context.isInitializing, context.authToken, context.user]);

    // Only check auth after context is initialized
    useEffect(() => {
        if (isContextInitialized) {
            // Now that context is initialized, check authentication status
            const authenticated = !!context.authToken && !!context.user;
            setIsAuthenticated(authenticated);
            setIsAuthChecked(true);
            
            console.log("ProtectedRoute: Authentication status checked.", { 
                authenticated, 
                hasToken: !!context.authToken, 
                hasUser: !!context.user,
                isContextInitialized
            });
        } else {
            console.log("ProtectedRoute: Waiting for context to initialize before checking auth...");
        }
    }, [isContextInitialized, context.authToken, context.user]);

    // Show loading while waiting for context to initialize or auth to be checked
    if (!isContextInitialized || !isAuthChecked) {
        console.log("ProtectedRoute: Waiting for context initialization or auth check to complete...");
        return <Loading />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        console.log("ProtectedRoute: User not authenticated, redirecting to login...");
        return <Navigate to="/login" replace />;
    }

    // User is authenticated, render children
    console.log("ProtectedRoute: User authenticated, rendering protected content...");
    return children;
} 