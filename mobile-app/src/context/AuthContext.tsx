import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../utils/api'; // We will set this up later

type AuthContextType = {
  user: any;
  role: string | null;
  loading: boolean;
  login: (token: string, userData: any, userRole: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from AsyncStorage
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const savedRole = await AsyncStorage.getItem('role');
        const savedUser = await AsyncStorage.getItem('user');

        if (token && savedRole && savedUser) {
          setUser(JSON.parse(savedUser));
          setRole(savedRole);
        }
      } catch (e) {
        console.error('Failed to restore session', e);
        await clearSession();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (token: string, userData: any, userRole: string) => {
    try {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', userRole);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setRole(userRole);
    } catch (e) {
      console.error('Failed to login session', e);
    }
  };

  const logout = async () => {
    await clearSession();
  };

  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('role');
      await AsyncStorage.removeItem('user');
      setUser(null);
      setRole(null);
    } catch (e) {
      console.error('Failed to clear session', e);
    }
  };

  const updateUser = async (updates: any) => {
    try {
      const updated = { ...user, ...updates };
      await AsyncStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    } catch (e) {
      console.error('Failed to update user', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
