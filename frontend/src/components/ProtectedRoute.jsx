import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute
 * Route guard wrapper for authenticated student dashboard routes.
 * Ensures that only logged-in users with a valid session can access protected routes.
 */
const ProtectedRoute = () => {
  const user = localStorage.getItem('edumitra_user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
