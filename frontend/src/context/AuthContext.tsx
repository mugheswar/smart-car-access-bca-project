import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
  }) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role: 'user' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smart_car_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smart_car_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('smart_car_token');
      if (storedToken) {
        try {
          const profile = await authService.getCurrentUser();
          setUser(profile);
          localStorage.setItem('smart_car_user', JSON.stringify(profile));
        } catch (err) {
          console.warn('Session verification failed, logging out:', err);
          localStorage.removeItem('smart_car_token');
          localStorage.removeItem('smart_car_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('smart_car_token', res.access_token);
      localStorage.setItem('smart_car_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('smart_car_token', res.access_token);
      localStorage.setItem('smart_car_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('smart_car_token');
    localStorage.removeItem('smart_car_user');
    setUser(null);
    setToken(null);
  };

  const quickDemoLogin = async (role: 'user' | 'admin') => {
    if (role === 'admin') {
      await login('admin@smartcar.local', 'Admin@123');
    } else {
      await login('user@smartcar.local', 'User@123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
