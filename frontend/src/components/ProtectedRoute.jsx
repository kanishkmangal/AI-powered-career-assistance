import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  checkAuthValidity,
  verifyAuthTokenWithBackend,
  clearAuthData,
  getStoredUser,
  getAuthToken,
} from '../services/api';

/**
 * ProtectedRoute
 * Route guard wrapper for authenticated student dashboard routes.
 * Ensures that only logged-in users with a valid, unexpired session (enforced by backend
 * 4-day Remember Me token) can access protected routes.
 */
const ProtectedRoute = () => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuthValidity());

  useEffect(() => {
    let isMounted = true;

    const validateAuth = async () => {
      // 1. Initial client-side validity check (token exists and not past timestamp)
      if (!checkAuthValidity()) {
        if (isMounted) {
          clearAuthData();
          setIsAuthenticated(false);
          setIsValidating(false);
        }
        return;
      }

      // 2. Server-side validation against backend (enforces backend 4-day expiration)
      try {
        const token = getAuthToken();
        const res = await verifyAuthTokenWithBackend(token);
        if (isMounted) {
          if (res && res.status === 'success') {
            setIsAuthenticated(true);
          } else {
            clearAuthData();
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          // Token expired or invalid on backend (HTTP 401)
          clearAuthData();
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsValidating(false);
        }
      }
    };

    validateAuth();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (isValidating) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[36px] text-primary animate-spin">
            progress_activity
          </span>
          <span className="font-body-md text-on-surface-variant">
            Validating session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
