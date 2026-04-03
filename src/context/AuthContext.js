import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const adminEmails = [
    'studymart21@gmail.com',
    'onomeraphaelfejiro@gmail.com',
    'fejiroforeigner@gmail.com'
  ];

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await api.post('/auth/signin', { email, password });
      
      if (response.data.success) {
        const { user: userData, session } = response.data;
        
        const isAdmin = adminEmails.includes(email);
        const userRole = userData.profile?.role || (isAdmin ? 'admin' : 'student');
        
        const userWithRole = {
          ...userData,
          profile: {
            ...userData.profile,
            role: userRole
          }
        };
        
        localStorage.setItem('user', JSON.stringify(userWithRole));
        localStorage.setItem('token', session.access_token);
        setUser(userWithRole);
        
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Sign in failed' 
      };
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      const isAdmin = adminEmails.includes(email);
      
      const response = await api.post('/auth/signup', { 
        email, 
        password, 
        fullName,
        role: isAdmin ? 'admin' : 'student'
      });
      
      if (response.data.success) {
        // Show success message - user needs to confirm email
        alert('Account created successfully! Please check your email to confirm your account before logging in.');
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Sign up failed' 
      };
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};