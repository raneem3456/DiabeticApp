import { useState, useCallback } from 'react';
import { useUIStore } from '../store/uiStore.js';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addNotification } = useUIStore();

  const callApi = useCallback(async (apiFunction, successMessage = null, errorMessage = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction();
      
      if (successMessage) {
        addNotification({
          type: 'success',
          message: successMessage,
        });
      }
      
      return result;
    } catch (err) {
      const errorMsg = errorMessage || err.response?.data?.message || 'An error occurred';
      setError(errorMsg);
      
      addNotification({
        type: 'error',
        message: errorMsg,
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError,
  };
};
