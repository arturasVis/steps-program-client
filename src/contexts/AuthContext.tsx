import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Staff } from '../services/api';

interface AuthContextType {
  isLoggedIn: boolean;
  currentStaff: Staff | null;
  login: (staff: Staff) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);

  useEffect(() => {
    // Check if user is already logged in on app start
    const storedStaff = localStorage.getItem('currentStaff');
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    
    if (storedStaff && storedLoginStatus === 'true') {
      try {
        const staff = JSON.parse(storedStaff);
        setCurrentStaff(staff);
        setIsLoggedIn(true);
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('currentStaff');
        localStorage.removeItem('isLoggedIn');
      }
    }
  }, []);

  const login = (staff: Staff) => {
    setCurrentStaff(staff);
    setIsLoggedIn(true);
    localStorage.setItem('currentStaff', JSON.stringify(staff));
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setCurrentStaff(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentStaff');
    localStorage.removeItem('isLoggedIn');
  };

  const value: AuthContextType = {
    isLoggedIn,
    currentStaff,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
