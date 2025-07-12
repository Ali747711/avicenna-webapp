import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('avicenna_token');
    const userData = localStorage.getItem('avicenna_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error('Invalid user data in localStorage:', err);
        localStorage.removeItem('avicenna_token');
        localStorage.removeItem('avicenna_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Sign up function
  const signUp = async (email, password, name) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual backend
      const response = await simulateApiCall({
        method: 'POST',
        url: '/api/auth/signup',
        data: { email, password, name }
      });

      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('avicenna_token', token);
        localStorage.setItem('avicenna_user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during sign up';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual backend
      const response = await simulateApiCall({
        method: 'POST',
        url: '/api/auth/signin',
        data: { email, password }
      });

      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('avicenna_token', token);
        localStorage.setItem('avicenna_user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during sign in';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    localStorage.removeItem('avicenna_token');
    localStorage.removeItem('avicenna_user');
    setUser(null);
    setError(null);
  };

  // Update user profile
  const updateProfile = async (updateData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual backend
      const response = await simulateApiCall({
        method: 'PUT',
        url: '/api/auth/profile',
        data: updateData
      });

      if (response.success) {
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('avicenna_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred updating profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Get auth token
  const getToken = () => {
    return localStorage.getItem('avicenna_token');
  };

  const value = {
    user,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    getToken,
    isAuthenticated: !!user,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Simulated API calls - replace with actual backend integration
const simulateApiCall = ({ method, url, data }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (url === '/api/auth/signup') {
        // Simulate successful signup
        resolve({
          success: true,
          data: {
            token: 'mock_jwt_token_' + Date.now(),
            user: {
              id: Date.now(),
              email: data.email,
              name: data.name,
              createdAt: new Date().toISOString(),
              preferences: {
                language: 'en',
                notifications: true
              }
            }
          }
        });
      } else if (url === '/api/auth/signin') {
        // Simulate successful signin
        resolve({
          success: true,
          data: {
            token: 'mock_jwt_token_' + Date.now(),
            user: {
              id: 12345,
              email: data.email,
              name: 'John Doe',
              createdAt: '2024-01-01T00:00:00.000Z',
              preferences: {
                language: 'en',
                notifications: true
              }
            }
          }
        });
      } else if (url === '/api/auth/profile') {
        // Simulate profile update
        resolve({
          success: true,
          data: data
        });
      }
    }, 1000); // Simulate network delay
  });
};

export default AuthProvider; 