import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredUser,
  getAuthToken,
  setAuthData,
  clearAuthData,
  logoutStudent,
  checkAuthValidity,
} from '../services/api';

/**
 * EduMitra AI - Authentication Context Architecture
 * Provides user state and token management across the frontend application.
 */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getAuthToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!checkAuthValidity()) {
      setUser(null);
      setToken(null);
    }
  }, []);

  const login = (userData, authToken, rememberMe = false, expiresAt = null) => {
    setUser(userData);
    setToken(authToken);
    setAuthData({
      user: userData,
      token: authToken,
      rememberMe,
      expiresAt,
    });
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await logoutStudent();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user && checkAuthValidity()),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
