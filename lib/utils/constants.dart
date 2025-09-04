class AppConstants {
  // API Constants
  static const String baseUrl = 'http://127.0.0.1:8000/api';
  static const int apiTimeout = 30; // seconds
  
  // Storage Keys
  static const String authTokenKey = 'auth_token';
  static const String userIdKey = 'user_id';
  static const String userRoleKey = 'user_role';
  
  // App Constants
  static const String appName = 'Diabetic App';
  static const String appVersion = '1.0.0';
  
  // Validation Constants
  static const int minPasswordLength = 6;
  static const int minNameLength = 2;
  
  // Glucose Reading Constants
  static const double normalGlucoseMin = 70.0;
  static const double normalGlucoseMax = 140.0;
  static const double highGlucoseThreshold = 180.0;
  static const double lowGlucoseThreshold = 70.0;
  
  // HbA1c Constants
  static const double normalHbA1cMin = 5.7;
  static const double normalHbA1cMax = 6.4;
  static const double diabeticHbA1cThreshold = 6.5;
  
  // Mood Constants
  static const int minMoodIntensity = 1;
  static const int maxMoodIntensity = 10;
  
  // Pagination Constants
  static const int defaultPageSize = 15;
  static const int maxPageSize = 100;
  
  // Date Formats
  static const String dateFormat = 'yyyy-MM-dd';
  static const String dateTimeFormat = 'yyyy-MM-dd HH:mm:ss';
  static const String displayDateFormat = 'MMM dd, yyyy';
  static const String displayTimeFormat = 'HH:mm';
  
  // Error Messages
  static const String networkErrorMessage = 'Network error occurred. Please check your connection.';
  static const String serverErrorMessage = 'Server error occurred. Please try again later.';
  static const String unknownErrorMessage = 'An unexpected error occurred.';
  
  // Success Messages
  static const String loginSuccessMessage = 'Login successful!';
  static const String registerSuccessMessage = 'Registration successful!';
  static const String logoutSuccessMessage = 'Logout successful!';
  static const String updateSuccessMessage = 'Updated successfully!';
  static const String deleteSuccessMessage = 'Deleted successfully!';
  
  // Role Names
  static const Map<String, String> roleNames = {
    'patient': 'Patient',
    'doctor': 'Doctor',
    'nutritionist': 'Nutritionist',
    'coach': 'Coach',
    'admin': 'Administrator',
    'family': 'Family Member',
  };
  
  // Role Descriptions
  static const Map<String, String> roleDescriptions = {
    'patient': 'Track your health data and manage diabetes',
    'doctor': 'Manage patient care and monitor progress',
    'nutritionist': 'Provide dietary guidance and meal planning',
    'coach': 'Support fitness and exercise programs',
    'admin': 'Manage system and user administration',
    'family': 'Support loved ones with diabetes',
  };
  
  // Glucose Sources
  static const List<String> glucoseSources = [
    'finger_prick',
    'continuous_monitor',
    'lab_test',
    'other',
  ];
  
  // Meal Types
  static const List<String> mealTypes = [
    'breakfast',
    'lunch',
    'dinner',
    'snack',
    'other',
  ];
  
  // Exercise Types
  static const List<String> exerciseTypes = [
    'cardio',
    'strength',
    'flexibility',
    'balance',
    'other',
  ];
  
  // Mood Types
  static const List<String> moodTypes = [
    'happy',
    'sad',
    'anxious',
    'stressed',
    'excited',
    'tired',
    'energetic',
    'calm',
    'other',
  ];
}
