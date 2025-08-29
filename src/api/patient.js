import apiClient from './config.js';

export const patientAPI = {
  // Glucose Readings
  getGlucoseReadings: async () => {
    const response = await apiClient.get('/patient/glucose-readings');
    return response.data;
  },

  createGlucoseReading: async (data) => {
    const response = await apiClient.post('/patient/glucose-readings', data);
    return response.data;
  },

  getGlucoseReading: async (id) => {
    const response = await apiClient.get(`/patient/glucose-readings/${id}`);
    return response.data;
  },

  updateGlucoseReading: async (id, data) => {
    const response = await apiClient.put(`/patient/glucose-readings/${id}`, data);
    return response.data;
  },

  deleteGlucoseReading: async (id) => {
    const response = await apiClient.delete(`/patient/glucose-readings/${id}`);
    return response.data;
  },

  // HbA1c Reports
  getHbA1cReports: async () => {
    const response = await apiClient.get('/patient/hba1c-reports');
    return response.data;
  },

  createHbA1cReport: async (data) => {
    const response = await apiClient.post('/patient/hba1c-reports', data);
    return response.data;
  },

  // Mood Tracking
  getMoods: async () => {
    const response = await apiClient.get('/patient/moods');
    return response.data;
  },

  createMoodEntry: async (data) => {
    const response = await apiClient.post('/patient/moods', data);
    return response.data;
  },

  // Challenge Entries
  getChallengeEntries: async () => {
    const response = await apiClient.get('/patient/challenge-entries');
    return response.data;
  },

  createChallengeEntry: async (data) => {
    const response = await apiClient.post('/patient/challenge-entries', data);
    return response.data;
  },

  // Nutrition Logs
  getNutritionLogs: async () => {
    const response = await apiClient.get('/patient/nutrition-logs');
    return response.data;
  },

  createNutritionLog: async (data) => {
    const response = await apiClient.post('/patient/nutrition-logs', data);
    return response.data;
  },

  // Workout Logs
  getWorkoutLogs: async () => {
    const response = await apiClient.get('/patient/workout-logs');
    return response.data;
  },

  createWorkoutLog: async (data) => {
    const response = await apiClient.post('/patient/workout-logs', data);
    return response.data;
  },

  // Profile Management
  getProfile: async () => {
    const response = await apiClient.get('/patient/profile');
    return response.data;
  },

  createProfile: async (data) => {
    const response = await apiClient.post('/patient/profile', data);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/patient/profile', data);
    return response.data;
  },
};
