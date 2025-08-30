<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Patient\GlucoseReadingController;
use App\Http\Controllers\Patient\ProfileController;
use App\Http\Controllers\Patient\NutritionLogController;
use App\Http\Controllers\Patient\WorkoutLogController;
use App\Http\Controllers\Patient\MoodController;
use App\Http\Controllers\Patient\Hba1cReportController;
use App\Http\Controllers\Patient\ChallengeEntryController;
use App\Http\Controllers\Doctor\DoctorNoteController;
use App\Http\Controllers\Doctor\LabOrderController;
use App\Http\Controllers\Doctor\DoctorRatingController;
use App\Http\Controllers\Doctor\MedicationController;
use App\Http\Controllers\Doctor\DoctorReportController;
use App\Http\Controllers\Nutritionist\MealController;
use App\Http\Controllers\Nutritionist\MealPlanController;
use App\Http\Controllers\Nutritionist\MealItemController;
use App\Http\Controllers\Nutritionist\MealPlanDayController;
use App\Http\Controllers\Coach\ExerciseController;
use App\Http\Controllers\Coach\WorkoutPlanController;
use App\Http\Controllers\Coach\WorkoutDayController;
use App\Http\Controllers\Admin\SurveyController;
use App\Http\Controllers\Admin\ChallengeController;
use App\Http\Controllers\Admin\SurveyQuestionController;
use App\Http\Controllers\Admin\SurveyAnswerController;
use App\Http\Controllers\Admin\RewardController;
use App\Http\Controllers\Admin\UserPointController;
use App\Http\Controllers\Community\PostController;
use App\Http\Controllers\Community\CommentController;
use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\Chat\MessageController;
use App\Http\Controllers\Emergency\EmergencyContactController;
use App\Http\Controllers\Emergency\EmergencyAlertController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Patient routes
    Route::prefix('patient')->middleware('role:patient')->group(function () {
        Route::apiResource('glucose-readings', GlucoseReadingController::class);
        Route::apiResource('nutrition-logs', NutritionLogController::class);
        Route::apiResource('workout-logs', WorkoutLogController::class);
        Route::apiResource('moods', MoodController::class);
        Route::apiResource('hba1c-reports', Hba1cReportController::class);
        Route::apiResource('challenge-entries', ChallengeEntryController::class);
        
        Route::get('profile', [ProfileController::class, 'show']);
        Route::post('profile', [ProfileController::class, 'store']);
        Route::put('profile', [ProfileController::class, 'update']);
    });

    // Doctor routes
    Route::prefix('doctor')->middleware('role:doctor')->group(function () {
        Route::apiResource('notes', DoctorNoteController::class);
        Route::apiResource('lab-orders', LabOrderController::class);
        Route::apiResource('ratings', DoctorRatingController::class);
        Route::apiResource('medications', MedicationController::class);
        
        Route::get('patients/{patient}/notes', [DoctorNoteController::class, 'patientNotes']);
        Route::get('patients/{patient}/lab-orders', [LabOrderController::class, 'patientOrders']);
        Route::get('patients/{patient}/medications', [MedicationController::class, 'patientMedications']);
        Route::get('patients/{patient}/active-medications', [MedicationController::class, 'activeMedications']);
        
        // Reports
        Route::get('reports/patient-statistics', [DoctorReportController::class, 'patientStatistics']);
        Route::get('reports/diabetes-type', [DoctorReportController::class, 'diabetesTypeReport']);
        Route::get('reports/age-group', [DoctorReportController::class, 'ageGroupReport']);
        Route::get('patients/{patient}/overview', [DoctorReportController::class, 'patientOverview']);
        Route::get('patients/{patient}/meal-plans', [DoctorReportController::class, 'patientMealPlans']);
        Route::get('patients/{patient}/workout-plans', [DoctorReportController::class, 'patientWorkoutPlans']);
    });

    // Nutritionist routes
    Route::prefix('nutritionist')->middleware('role:nutritionist')->group(function () {
        Route::apiResource('meals', MealController::class);
        Route::apiResource('meal-plans', MealPlanController::class);
        Route::apiResource('meal-items', MealItemController::class);
        Route::apiResource('meal-plan-days', MealPlanDayController::class);
        
        Route::get('patients/{patient}/meal-plans', [MealPlanController::class, 'patientPlans']);
        
        // Meal plan day specific routes
        Route::post('meal-plan-days/{mealPlanDay}/attach-meal', [MealPlanDayController::class, 'attachMeal']);
        Route::delete('meal-plan-days/{mealPlanDay}/detach-meal', [MealPlanDayController::class, 'detachMeal']);
    });

    // Coach routes
    Route::prefix('coach')->middleware('role:coach')->group(function () {
        Route::apiResource('exercises', ExerciseController::class);
        Route::apiResource('workout-plans', WorkoutPlanController::class);
        Route::apiResource('workout-days', WorkoutDayController::class);
        
        Route::get('patients/{patient}/workout-plans', [WorkoutPlanController::class, 'patientPlans']);
        
        // Workout day specific routes
        Route::post('workout-days/{workoutDay}/attach-exercise', [WorkoutDayController::class, 'attachExercise']);
        Route::delete('workout-days/{workoutDay}/detach-exercise', [WorkoutDayController::class, 'detachExercise']);
    });

    // Admin routes
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::apiResource('surveys', SurveyController::class);
        Route::apiResource('challenges', ChallengeController::class);
        Route::apiResource('survey-questions', SurveyQuestionController::class);
        Route::apiResource('survey-answers', SurveyAnswerController::class);
        Route::apiResource('rewards', RewardController::class);
        Route::apiResource('user-points', UserPointController::class);
        
        Route::get('user-points/{userId}/total', [UserPointController::class, 'userTotal']);
    });

    // Family routes
    Route::prefix('family')->middleware('role:family')->group(function () {
        // Family member routes for viewing patient data
    });

    // Community routes (accessible by all authenticated users)
    Route::prefix('community')->group(function () {
        Route::apiResource('posts', PostController::class);
        Route::apiResource('comments', CommentController::class);
        
        Route::post('posts/{post}/like', [PostController::class, 'like']);
        Route::delete('posts/{post}/like', [PostController::class, 'unlike']);
        Route::post('comments/{comment}/like', [CommentController::class, 'like']);
        Route::delete('comments/{comment}/like', [CommentController::class, 'unlike']);
    });

    // Chat routes (accessible by all authenticated users)
    Route::prefix('chat')->group(function () {
        Route::apiResource('chats', ChatController::class);
        Route::apiResource('messages', MessageController::class);
        
        Route::post('chats/{chat}/add-participant', [ChatController::class, 'addParticipant']);
        Route::delete('chats/{chat}/remove-participant', [ChatController::class, 'removeParticipant']);
        Route::post('chats/{chat}/mark-read', [ChatController::class, 'markAsRead']);
        Route::post('messages/{message}/mark-read', [MessageController::class, 'markAsRead']);
    });

    // Emergency routes (accessible by patients and family members)
    Route::prefix('emergency')->middleware('role:patient,family')->group(function () {
        Route::apiResource('contacts', EmergencyContactController::class);
        Route::apiResource('alerts', EmergencyAlertController::class);
        
        Route::post('alerts/{emergencyAlert}/acknowledge', [EmergencyAlertController::class, 'acknowledge']);
        Route::post('alerts/{emergencyAlert}/resolve', [EmergencyAlertController::class, 'resolve']);
    });

    // Shared routes (accessible by multiple roles)
    Route::prefix('shared')->group(function () {
        // Routes that can be accessed by patients, doctors, nutritionists, coaches
    });
});
