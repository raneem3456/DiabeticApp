import apiClient from './config.js';

export const coachAPI = {
  // Exercises
  getExercises: async () => {
    const response = await apiClient.get('/coach/exercises');
    return response.data;
  },

  createExercise: async (data) => {
    const response = await apiClient.post('/coach/exercises', data);
    return response.data;
  },

  // Workout Plans
  getWorkoutPlans: async () => {
    const response = await apiClient.get('/coach/workout-plans');
    return response.data;
  },

  createWorkoutPlan: async (data) => {
    const response = await apiClient.post('/coach/workout-plans', data);
    return response.data;
  },

  getPatientWorkoutPlans: async () => {
    const response = await apiClient.get('/coach/patient-workout-plans');
    return response.data;
  },

  // Workout Days
  getWorkoutDays: async () => {
    const response = await apiClient.get('/coach/workout-days');
    return response.data;
  },

  createWorkoutDay: async (data) => {
    const response = await apiClient.post('/coach/workout-days', data);
    return response.data;
  },

  attachExerciseToDay: async (data) => {
    const response = await apiClient.post('/coach/attach-exercise-to-day', data);
    return response.data;
  },
};
