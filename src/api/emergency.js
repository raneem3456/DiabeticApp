import apiClient from './config.js';

export const emergencyAPI = {
  // Emergency Contacts
  getEmergencyContacts: async () => {
    const response = await apiClient.get('/emergency/contacts');
    return response.data;
  },

  createEmergencyContact: async (data) => {
    const response = await apiClient.post('/emergency/contacts', data);
    return response.data;
  },

  getEmergencyContact: async (id) => {
    const response = await apiClient.get(`/emergency/contacts/${id}`);
    return response.data;
  },

  updateEmergencyContact: async (id, data) => {
    const response = await apiClient.put(`/emergency/contacts/${id}`, data);
    return response.data;
  },

  deleteEmergencyContact: async (id) => {
    const response = await apiClient.delete(`/emergency/contacts/${id}`);
    return response.data;
  },

  // Emergency Alerts
  getEmergencyAlerts: async () => {
    const response = await apiClient.get('/emergency/alerts');
    return response.data;
  },

  createEmergencyAlert: async (data) => {
    const response = await apiClient.post('/emergency/alerts', data);
    return response.data;
  },

  getEmergencyAlert: async (id) => {
    const response = await apiClient.get(`/emergency/alerts/${id}`);
    return response.data;
  },

  updateEmergencyAlert: async (id, data) => {
    const response = await apiClient.put(`/emergency/alerts/${id}`, data);
    return response.data;
  },

  deleteEmergencyAlert: async (id) => {
    const response = await apiClient.delete(`/emergency/alerts/${id}`);
    return response.data;
  },
};
