import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Mock authentication functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock user validation - in a real app, this would be a server call
    const mockUsers = localStorage.getItem('users');
    const users: User[] = mockUsers ? JSON.parse(mockUsers) : [];
    
    const user = users.find((u) => u.email === email);
    if (!user) {
      return false;
    }
    
    // In a real app, you would verify the password hash here
    // For demo purposes, we're just checking if the user exists
    
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
    localStorage.setItem('user', JSON.stringify(user));
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const mockUsers = localStorage.getItem('users');
    const users: User[] = mockUsers ? JSON.parse(mockUsers) : [];
    
    if (users.some((u) => u.email === email)) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    
    // In a real app, you would hash the password before storing
    
    // Add user to mock database
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Log in the new user
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return;
    
    const updatedUser = { ...authState.user, ...userData };
    
    // Update in context
    setAuthState({
      user: updatedUser,
      isAuthenticated: true,
      isLoading: false,
    });
    
    // Update in storage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in mock users list
    const mockUsers = localStorage.getItem('users');
    if (mockUsers) {
      const users: User[] = JSON.parse(mockUsers);
      const updatedUsers = users.map((u) => 
        u.id === updatedUser.id ? updatedUser : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};