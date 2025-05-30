import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

interface Student {
  id: number;
  student_id: string;
  phone: string;
  birth_date: string;
  gender: string;
  birth_place: string;
  address: string;
  class: string;
  field: string;
  enrollment_date: string;
  status: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  photo: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  student: Student | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    birth_date: string;
    gender: string;
    birth_place: string;
    address: string;
    class: string;
    field: string;
    enrollment_date: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      const currentStudent = authService.getCurrentStudent();
      setUser(currentUser);
      setStudent(currentStudent);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.data.user);
      if (response.data.student) {
        setStudent(response.data.student);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    birth_date: string;
    gender: string;
    birth_place: string;
    address: string;
    class: string;
    field: string;
    enrollment_date: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(data);
      setUser(response.data.user);
      if (response.data.student) {
        setStudent(response.data.student);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setStudent(null);
  };

  const value = {
    user,
    student,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
