import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../utils/constants.js';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
    clearError,
    initialize,
  } = useAuthStore();

  const navigate = useNavigate();

  // Get current user on mount if token exists
  useEffect(() => {
    if (token && !user) {
      getCurrentUser().catch(() => {
        // If getCurrentUser fails, clear auth state
        logout();
      });
    }
  }, [token, user, getCurrentUser, logout]);

  // Redirect based on role
  const redirectByRole = (role) => {
    switch (role) {
      case ROLES.PATIENT:
        navigate('/dashboard');
        break;
      case ROLES.DOCTOR:
        navigate('/dashboard');
        break;
      case ROLES.NUTRITIONIST:
        navigate('/dashboard');
        break;
      case ROLES.COACH:
        navigate('/dashboard');
        break;
      case ROLES.ADMIN:
        navigate('/dashboard');
        break;
      case ROLES.FAMILY:
        navigate('/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // Login with redirect
  const loginWithRedirect = async (credentials) => {
    try {
      const response = await login(credentials);
      redirectByRole(response.user.role);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Register with redirect
  const registerWithRedirect = async (userData) => {
    try {
      const response = await register(userData);
      redirectByRole(response.user.role);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Logout with redirect
  const logoutWithRedirect = async () => {
    await logout();
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login: loginWithRedirect,
    register: registerWithRedirect,
    logout: logoutWithRedirect,
    getCurrentUser,
    clearError,
    initialize,
  };
};
