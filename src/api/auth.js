import apiClient from './config.js';

export const authAPI = {
  // Register a new user
  registerUser: async (userData) => {
    const response = await apiClient.post('/register', userData);
    return response.data;
  },

  // Login user
  loginUser: async (credentials) => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/me');
    return response.data;
  },

  // Logout user
  logoutUser: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  },
};
