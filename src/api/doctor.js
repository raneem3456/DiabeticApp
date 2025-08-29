import apiClient from './config.js';

export const doctorAPI = {
  // Reports
  getPatientStatistics: async () => {
    const response = await apiClient.get('/doctor/patient-statistics');
    return response.data;
  },

  getDiabetesTypeReport: async () => {
    const response = await apiClient.get('/doctor/diabetes-type-report');
    return response.data;
  },

  getAgeGroupReport: async () => {
    const response = await apiClient.get('/doctor/age-group-report');
    return response.data;
  },

  // Patient Management
  getPatientOverview: async () => {
    const response = await apiClient.get('/doctor/patient-overview');
    return response.data;
  },

  getPatientMealPlans: async () => {
    const response = await apiClient.get('/doctor/patient-meal-plans');
    return response.data;
  },

  getPatientWorkoutPlans: async () => {
    const response = await apiClient.get('/doctor/patient-workout-plans');
    return response.data;
  },

  // Medications
  getMedications: async () => {
    const response = await apiClient.get('/doctor/medications');
    return response.data;
  },

  createMedication: async (data) => {
    const response = await apiClient.post('/doctor/medications', data);
    return response.data;
  },

  getPatientMedications: async () => {
    const response = await apiClient.get('/doctor/patient-medications');
    return response.data;
  },

  getActiveMedications: async () => {
    const response = await apiClient.get('/doctor/active-medications');
    return response.data;
  },

  // Doctor Notes
  getNotes: async () => {
    const response = await apiClient.get('/doctor/notes');
    return response.data;
  },

  createNote: async (data) => {
    const response = await apiClient.post('/doctor/notes', data);
    return response.data;
  },

  getPatientNotes: async () => {
    const response = await apiClient.get('/doctor/patient-notes');
    return response.data;
  },

  // Lab Orders
  getLabOrders: async () => {
    const response = await apiClient.get('/doctor/lab-orders');
    return response.data;
  },

  createLabOrder: async (data) => {
    const response = await apiClient.post('/doctor/lab-orders', data);
    return response.data;
  },

  getPatientLabOrders: async () => {
    const response = await apiClient.get('/doctor/patient-lab-orders');
    return response.data;
  },

  // Doctor Ratings
  getRatings: async () => {
    const response = await apiClient.get('/doctor/ratings');
    return response.data;
  },

  createRating: async (data) => {
    const response = await apiClient.post('/doctor/ratings', data);
    return response.data;
  },
};
