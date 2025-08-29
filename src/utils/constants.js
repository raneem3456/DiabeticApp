// User roles
export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  NUTRITIONIST: 'nutritionist',
  COACH: 'coach',
  ADMIN: 'admin',
  FAMILY: 'family',
};

// Role display names
export const ROLE_NAMES = {
  [ROLES.PATIENT]: 'Patient',
  [ROLES.DOCTOR]: 'Doctor',
  [ROLES.NUTRITIONIST]: 'Nutritionist',
  [ROLES.COACH]: 'Coach',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.FAMILY]: 'Family Member',
};

// Navigation items by role
export const NAVIGATION_ITEMS = {
  [ROLES.PATIENT]: [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Glucose Readings', path: '/patient/glucose-readings', icon: '🩸' },
    { name: 'HbA1c Reports', path: '/patient/hba1c-reports', icon: '📈' },
    { name: 'Mood Tracking', path: '/patient/mood-tracking', icon: '😊' },
    { name: 'Nutrition Logs', path: '/patient/nutrition-logs', icon: '🍎' },
    { name: 'Workout Logs', path: '/patient/workout-logs', icon: '💪' },
    { name: 'Profile', path: '/patient/profile', icon: '👤' },
    { name: 'Community Posts', path: '/community/posts', icon: '👥' },
    { name: 'Chat', path: '/chat/chats', icon: '💬' },
    { name: 'Emergency Contacts', path: '/emergency/contacts', icon: '🚨' },
  ],
  [ROLES.DOCTOR]: [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Patients Overview', path: '/doctor/patients-overview', icon: '👥' },
    { name: 'Reports', path: '/doctor/reports', icon: '📈' },
    { name: 'Medications', path: '/doctor/medications', icon: '💊' },
    { name: 'Notes', path: '/doctor/notes', icon: '📝' },
    { name: 'Lab Orders', path: '/doctor/lab-orders', icon: '🔬' },
    { name: 'Community Posts', path: '/community/posts', icon: '👥' },
    { name: 'Chat', path: '/chat/chats', icon: '💬' },
    { name: 'Emergency Contacts', path: '/emergency/contacts', icon: '🚨' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ],
  [ROLES.NUTRITIONIST]: [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Meals', path: '/nutritionist/meals', icon: '🍽️' },
    { name: 'Meal Plans', path: '/nutritionist/meal-plans', icon: '📋' },
    { name: 'Community Posts', path: '/community/posts', icon: '👥' },
    { name: 'Chat', path: '/chat/chats', icon: '💬' },
    { name: 'Emergency Contacts', path: '/emergency/contacts', icon: '🚨' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ],
  [ROLES.COACH]: [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Exercises', path: '/coach/exercises', icon: '🏃‍♂️' },
    { name: 'Workout Plans', path: '/coach/workout-plans', icon: '📋' },
    { name: 'Community Posts', path: '/community/posts', icon: '👥' },
    { name: 'Chat', path: '/chat/chats', icon: '💬' },
    { name: 'Emergency Contacts', path: '/emergency/contacts', icon: '🚨' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ],
  [ROLES.ADMIN]: [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Surveys', path: '/admin/surveys', icon: '📝' },
    { name: 'Challenges', path: '/admin/challenges', icon: '🏆' },
    { name: 'Rewards', path: '/admin/rewards', icon: '🎁' },
    { name: 'User Points', path: '/admin/user-points', icon: '⭐' },
    { name: 'Community Posts', path: '/community/posts', icon: '👥' },
    { name: 'Chat', path: '/chat/chats', icon: '💬' },
    { name: 'Emergency Contacts', path: '/emergency/contacts', icon: '🚨' },
    { name: 'Users', path: '/users', icon: '👥' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ],
  [ROLES.FAMILY]: [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Patient Overview', path: '/patient-overview', icon: '👥' },
    { name: 'Emergency', path: '/emergency', icon: '🚨' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ],
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    ME: '/me',
  },
  PATIENT: {
    GLUCOSE_READINGS: '/patient/glucose-readings',
    HBA1C_REPORTS: '/patient/hba1c-reports',
    MOODS: '/patient/moods',
    NUTRITION_LOGS: '/patient/nutrition-logs',
    WORKOUT_LOGS: '/patient/workout-logs',
    PROFILE: '/patient/profile',
  },
  DOCTOR: {
    PATIENTS: '/doctor/patients',
    REPORTS: '/doctor/reports',
    MEDICATIONS: '/doctor/medications',
    NOTES: '/doctor/notes',
    LAB_ORDERS: '/doctor/lab-orders',
  },
  NUTRITIONIST: {
    MEALS: '/nutritionist/meals',
    MEAL_PLANS: '/nutritionist/meal-plans',
    PATIENTS: '/nutritionist/patients',
  },
  COACH: {
    EXERCISES: '/coach/exercises',
    WORKOUT_PLANS: '/coach/workout-plans',
    PATIENTS: '/coach/patients',
  },
  ADMIN: {
    SURVEYS: '/admin/surveys',
    CHALLENGES: '/admin/challenges',
    REWARDS: '/admin/rewards',
    USER_POINTS: '/admin/user-points',
    USERS: '/admin/users',
  },
  COMMUNITY: {
    POSTS: '/community/posts',
    COMMENTS: '/community/comments',
    LIKES: '/community/likes',
  },
  CHAT: {
    CHATS: '/chat/chats',
    MESSAGES: '/chat/messages',
  },
  EMERGENCY: {
    CONTACTS: '/emergency/contacts',
    ALERTS: '/emergency/alerts',
  },
};

// Glucose reading sources
export const GLUCOSE_SOURCES = [
  'finger_prick',
  'continuous_monitor',
  'other',
];

// Glucose reading meal contexts
export const MEAL_CONTEXTS = [
  'fasting',
  'before_breakfast',
  'after_breakfast',
  'before_lunch',
  'after_lunch',
  'before_dinner',
  'after_dinner',
  'before_sleep',
  'other',
];

// Mood levels
export const MOOD_LEVELS = [
  { value: 1, label: 'Very Poor', emoji: '😢' },
  { value: 2, label: 'Poor', emoji: '😕' },
  { value: 3, label: 'Fair', emoji: '😐' },
  { value: 4, label: 'Good', emoji: '🙂' },
  { value: 5, label: 'Excellent', emoji: '😄' },
];

// Exercise types
export const EXERCISE_TYPES = [
  'cardio',
  'strength',
  'flexibility',
  'balance',
  'other',
];

// Meal types
export const MEAL_TYPES = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'other',
];

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
