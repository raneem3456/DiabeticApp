import apiClient from './config.js';

export const nutritionistAPI = {
  // Meals
  getMeals: async () => {
    const response = await apiClient.get('/nutritionist/meals');
    return response.data;
  },

  createMeal: async (data) => {
    const response = await apiClient.post('/nutritionist/meals', data);
    return response.data;
  },

  // Meal Items
  getMealItems: async () => {
    const response = await apiClient.get('/nutritionist/meal-items');
    return response.data;
  },

  createMealItem: async (data) => {
    const response = await apiClient.post('/nutritionist/meal-items', data);
    return response.data;
  },

  // Meal Plans
  getMealPlans: async () => {
    const response = await apiClient.get('/nutritionist/meal-plans');
    return response.data;
  },

  createMealPlan: async (data) => {
    const response = await apiClient.post('/nutritionist/meal-plans', data);
    return response.data;
  },

  getPatientMealPlans: async () => {
    const response = await apiClient.get('/nutritionist/patient-meal-plans');
    return response.data;
  },

  // Meal Plan Days
  getMealPlanDays: async () => {
    const response = await apiClient.get('/nutritionist/meal-plan-days');
    return response.data;
  },

  createMealPlanDay: async (data) => {
    const response = await apiClient.post('/nutritionist/meal-plan-days', data);
    return response.data;
  },

  attachMealToDay: async (data) => {
    const response = await apiClient.post('/nutritionist/attach-meal-to-day', data);
    return response.data;
  },
};
