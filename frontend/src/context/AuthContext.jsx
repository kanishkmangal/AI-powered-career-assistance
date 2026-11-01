import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * EduMitra AI - Authentication Context Architecture
 * Provides user state and token management across the frontend application.
 */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('edumitra_auth_token'));
  const [loading, setLoading] = useState(false);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if (authToken) {
      localStorage.setItem('edumitra_auth_token', authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('edumitra_auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(token), loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

