'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on client mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('it_auth_token');
      const storedUser = localStorage.getItem('it_auth_user');

      if (storedToken && storedUser && storedUser !== 'undefined') {
        let parsedUser = null;
        try {
          parsedUser = JSON.parse(storedUser);
        } catch {
          logout();
          setIsLoading(false);
          return;
        }

        if (parsedUser && typeof parsedUser === 'object') {
          setToken(storedToken);
          setUser(parsedUser);

          // Background check to keep profile fresh
          getMe(storedToken)
            .then((res) => {
              if (res?.user) {
                setUser(res.user);
                localStorage.setItem('it_auth_user', JSON.stringify(res.user));
              } else {
                logout();
              }
            })
            .catch(() => {})
            .finally(() => setIsLoading(false));
        } else {
          logout();
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  }, []);

  const login = (authToken, userData) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('it_auth_token', authToken);
    localStorage.setItem('it_auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('it_auth_token');
    localStorage.removeItem('it_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
