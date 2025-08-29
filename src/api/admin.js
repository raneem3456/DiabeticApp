import apiClient from './config.js';

export const adminAPI = {
  // Surveys
  getSurveys: async () => {
    const response = await apiClient.get('/admin/surveys');
    return response.data;
  },

  createSurvey: async (data) => {
    const response = await apiClient.post('/admin/surveys', data);
    return response.data;
  },

  // Survey Questions
  getSurveyQuestions: async () => {
    const response = await apiClient.get('/admin/survey-questions');
    return response.data;
  },

  createSurveyQuestion: async (data) => {
    const response = await apiClient.post('/admin/survey-questions', data);
    return response.data;
  },

  // Survey Answers
  getSurveyAnswers: async () => {
    const response = await apiClient.get('/admin/survey-answers');
    return response.data;
  },

  createSurveyAnswer: async (data) => {
    const response = await apiClient.post('/admin/survey-answers', data);
    return response.data;
  },

  // Challenges
  getChallenges: async () => {
    const response = await apiClient.get('/admin/challenges');
    return response.data;
  },

  createChallenge: async (data) => {
    const response = await apiClient.post('/admin/challenges', data);
    return response.data;
  },

  // Rewards
  getRewards: async () => {
    const response = await apiClient.get('/admin/rewards');
    return response.data;
  },

  createReward: async (data) => {
    const response = await apiClient.post('/admin/rewards', data);
    return response.data;
  },

  // User Points
  getUserPoints: async () => {
    const response = await apiClient.get('/admin/user-points');
    return response.data;
  },

  createUserPoint: async (data) => {
    const response = await apiClient.post('/admin/user-points', data);
    return response.data;
  },
};
