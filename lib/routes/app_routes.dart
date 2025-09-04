import 'package:get/get.dart';
import '../controllers/auth_controller.dart';
import '../middleware/auth_middleware.dart';
import '../views/auth/login_page.dart';
import '../views/auth/register_page.dart';
import '../views/dashboard/patient_dashboard.dart';
import '../views/dashboard/doctor_dashboard.dart';
import '../views/dashboard/nutritionist_dashboard.dart';
import '../views/dashboard/coach_dashboard.dart';
import '../views/dashboard/admin_dashboard.dart';
import '../views/dashboard/family_dashboard.dart';
import '../views/profile/profile_page.dart';
import '../views/splash/splash_page.dart';

// Patient pages
import '../views/patient/patient_glucose_readings_page.dart';
import '../views/patient/patient_hba1c_reports_page.dart';
import '../views/patient/patient_nutrition_logs_page.dart';
import '../views/patient/patient_workout_logs_page.dart';
import '../views/patient/patient_mood_tracking_page.dart';

// Doctor pages
import '../views/doctor/doctor_patient_management_page.dart';
import '../views/doctor/doctor_reports_page.dart';
import '../views/doctor/doctor_medications_page.dart';
import '../views/doctor/doctor_lab_orders_page.dart';
import '../views/doctor/doctor_notes_page.dart';

// Nutritionist pages
import '../views/nutritionist/nutritionist_meals_page.dart';
import '../views/nutritionist/nutritionist_meal_plans_page.dart';
import '../views/nutritionist/nutritionist_meal_items_page.dart';
import '../views/nutritionist/nutritionist_patient_meal_plans_page.dart';

// Coach pages
import '../views/coach/coach_exercises_page.dart';
import '../views/coach/coach_workout_plans_page.dart';
import '../views/coach/coach_workout_days_page.dart';

// Admin pages
import '../views/admin/admin_user_management_page.dart';
import '../views/admin/admin_surveys_page.dart';
import '../views/admin/admin_challenges_page.dart';
import '../views/admin/admin_moderation_page.dart';

class AppRoutes {
  static const String splash = '/';
  static const String login = '/login';
  static const String register = '/register';
  
  // Role-based dashboard routes
  static const String patientDashboard = '/patient/dashboard';
  static const String doctorDashboard = '/doctor/dashboard';
  static const String nutritionistDashboard = '/nutritionist/dashboard';
  static const String coachDashboard = '/coach/dashboard';
  static const String adminDashboard = '/admin/dashboard';
  static const String familyDashboard = '/family/dashboard';
  
  // Common routes
  static const String profile = '/profile';
  
  // Patient specific routes
  static const String patientGlucoseReadings = '/patient/glucose-readings';
  static const String patientHbA1cReports = '/patient/hba1c-reports';
  static const String patientNutritionLogs = '/patient/nutrition-logs';
  static const String patientWorkoutLogs = '/patient/workout-logs';
  static const String patientMoodTracking = '/patient/mood-tracking';
  
  // Doctor specific routes
  static const String doctorPatientManagement = '/doctor/patient-management';
  static const String doctorReports = '/doctor/reports';
  static const String doctorMedications = '/doctor/medications';
  static const String doctorLabOrders = '/doctor/lab-orders';
  static const String doctorNotes = '/doctor/notes';
  
  // Nutritionist specific routes
  static const String nutritionistMeals = '/nutritionist/meals';
  static const String nutritionistMealPlans = '/nutritionist/meal-plans';
  static const String nutritionistMealItems = '/nutritionist/meal-items';
  static const String nutritionistPatientMealPlans = '/nutritionist/patient-meal-plans';
  
  // Coach specific routes
  static const String coachExercises = '/coach/exercises';
  static const String coachWorkoutPlans = '/coach/workout-plans';
  static const String coachWorkoutDays = '/coach/workout-days';
  
  // Admin specific routes
  static const String adminUserManagement = '/admin/user-management';
  static const String adminSurveys = '/admin/surveys';
  static const String adminChallenges = '/admin/challenges';
  static const String adminModeration = '/admin/moderation';

  static final routes = [
    // Splash
    GetPage(
      name: splash,
      page: () => const SplashPage(),
      transition: Transition.fadeIn,
      middlewares: [GuestMiddleware()],
    ),

    // Public routes
    GetPage(
      name: login,
      page: () => const LoginPage(),
      transition: Transition.fadeIn,
      middlewares: [GuestMiddleware()],
    ),
    GetPage(
      name: register,
      page: () => const RegisterPage(),
      transition: Transition.fadeIn,
      middlewares: [GuestMiddleware()],
    ),
    
    // Role-based dashboard routes
    GetPage(
      name: patientDashboard,
      page: () => const PatientDashboard(),
      transition: Transition.fadeIn,
      middlewares: [PatientMiddleware()],
    ),
    GetPage(
      name: doctorDashboard,
      page: () => const DoctorDashboard(),
      transition: Transition.fadeIn,
      middlewares: [DoctorMiddleware()],
    ),
    GetPage(
      name: nutritionistDashboard,
      page: () => const NutritionistDashboard(),
      transition: Transition.fadeIn,
      middlewares: [NutritionistMiddleware()],
    ),
    GetPage(
      name: coachDashboard,
      page: () => const CoachDashboard(),
      transition: Transition.fadeIn,
      middlewares: [CoachMiddleware()],
    ),
    GetPage(
      name: adminDashboard,
      page: () => const AdminDashboard(),
      transition: Transition.fadeIn,
      middlewares: [AdminMiddleware()],
    ),
    GetPage(
      name: familyDashboard,
      page: () => const FamilyDashboard(),
      transition: Transition.fadeIn,
      middlewares: [FamilyMiddleware()],
    ),
    
    // Common authenticated routes
    GetPage(
      name: profile,
      page: () => const ProfilePage(),
      transition: Transition.fadeIn,
      middlewares: [AuthenticatedMiddleware()],
    ),
    
    // Patient specific routes
    GetPage(
      name: patientGlucoseReadings,
      page: () => const PatientGlucoseReadingsPage(),
      transition: Transition.fadeIn,
      middlewares: [PatientMiddleware()],
    ),
    GetPage(
      name: patientHbA1cReports,
      page: () => const PatientHbA1cReportsPage(),
      transition: Transition.fadeIn,
      middlewares: [PatientMiddleware()],
    ),
    GetPage(
      name: patientNutritionLogs,
      page: () => const PatientNutritionLogsPage(),
      transition: Transition.fadeIn,
      middlewares: [PatientMiddleware()],
    ),
    GetPage(
      name: patientWorkoutLogs,
      page: () => const PatientWorkoutLogsPage(),
      transition: Transition.fadeIn,
      middlewares: [PatientMiddleware()],
    ),
    GetPage(
      name: patientMoodTracking,
      page: () => const PatientMoodTrackingPage(),
      transition: Transition.fadeIn,
      middlewares: [PatientMiddleware()],
    ),
    
    // Doctor specific routes
    GetPage(
      name: doctorPatientManagement,
      page: () => const DoctorPatientManagementPage(),
      transition: Transition.fadeIn,
      middlewares: [DoctorMiddleware()],
    ),
    GetPage(
      name: doctorReports,
      page: () => const DoctorReportsPage(),
      transition: Transition.fadeIn,
      middlewares: [DoctorMiddleware()],
    ),
    GetPage(
      name: doctorMedications,
      page: () => const DoctorMedicationsPage(),
      transition: Transition.fadeIn,
      middlewares: [DoctorMiddleware()],
    ),
    GetPage(
      name: doctorLabOrders,
      page: () => const DoctorLabOrdersPage(),
      transition: Transition.fadeIn,
      middlewares: [DoctorMiddleware()],
    ),
    GetPage(
      name: doctorNotes,
      page: () => const DoctorNotesPage(),
      transition: Transition.fadeIn,
      middlewares: [DoctorMiddleware()],
    ),
    
    // Nutritionist specific routes
    GetPage(
      name: nutritionistMeals,
      page: () => const NutritionistMealsPage(),
      transition: Transition.fadeIn,
      middlewares: [NutritionistMiddleware()],
    ),
    GetPage(
      name: nutritionistMealPlans,
      page: () => const NutritionistMealPlansPage(),
      transition: Transition.fadeIn,
      middlewares: [NutritionistMiddleware()],
    ),
    GetPage(
      name: nutritionistMealItems,
      page: () => const NutritionistMealItemsPage(),
      transition: Transition.fadeIn,
      middlewares: [NutritionistMiddleware()],
    ),
    GetPage(
      name: nutritionistPatientMealPlans,
      page: () => const NutritionistPatientMealPlansPage(),
      transition: Transition.fadeIn,
      middlewares: [NutritionistMiddleware()],
    ),
    
    // Coach specific routes
    GetPage(
      name: coachExercises,
      page: () => const CoachExercisesPage(),
      transition: Transition.fadeIn,
      middlewares: [CoachMiddleware()],
    ),
    GetPage(
      name: coachWorkoutPlans,
      page: () => const CoachWorkoutPlansPage(),
      transition: Transition.fadeIn,
      middlewares: [CoachMiddleware()],
    ),
    GetPage(
      name: coachWorkoutDays,
      page: () => const CoachWorkoutDaysPage(),
      transition: Transition.fadeIn,
      middlewares: [CoachMiddleware()],
    ),
    
    // Admin specific routes
    GetPage(
      name: adminUserManagement,
      page: () => const AdminUserManagementPage(),
      transition: Transition.fadeIn,
      middlewares: [AdminMiddleware()],
    ),
    GetPage(
      name: adminSurveys,
      page: () => const AdminSurveysPage(),
      transition: Transition.fadeIn,
      middlewares: [AdminMiddleware()],
    ),
    GetPage(
      name: adminChallenges,
      page: () => const AdminChallengesPage(),
      transition: Transition.fadeIn,
      middlewares: [AdminMiddleware()],
    ),
    GetPage(
      name: adminModeration,
      page: () => const AdminModerationPage(),
      transition: Transition.fadeIn,
      middlewares: [AdminMiddleware()],
    ),
  ];
}

class RouteHelper {
  static void navigateToDashboard() {
    final authController = AuthController.to;
    authController.navigateToDashboard();
  }
  
  static String getDashboardRoute() {
    final authController = AuthController.to;
    return authController.dashboardRoute;
  }
}
