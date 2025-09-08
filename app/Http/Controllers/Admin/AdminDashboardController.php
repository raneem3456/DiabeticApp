<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\GlucoseReading;
use App\Models\NutritionLog;
use App\Models\WorkoutLog;
use App\Models\Survey;
use App\Models\Challenge;
use App\Models\Post;
use App\Models\Message;
use App\Models\EmergencyAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class AdminDashboardController extends Controller
{
    public function overview(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->subDays(30));
        $dateTo = $request->get('date_to', now());

        $overview = [
            'system_stats' => $this->getSystemStats($dateFrom, $dateTo),
            'user_stats' => $this->getUserStats($dateFrom, $dateTo),
            'engagement_stats' => $this->getEngagementStats($dateFrom, $dateTo),
            'health_stats' => $this->getHealthStats($dateFrom, $dateTo),
            'recent_activities' => $this->getRecentActivities(),
            'system_health' => $this->getSystemHealth(),
        ];

        return response()->json($overview);
    }

    public function userManagement(Request $request)
    {
        $query = User::with(['profile', 'roles']);

        // Advanced filtering
        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->has('status')) {
            $query->where('is_active', $request->boolean('status'));
        }

        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 20));

        return response()->json($users);
    }

    public function userDetails(Request $request, $userId)
    {
        $user = User::with(['profile', 'roles'])->findOrFail($userId);

        $userDetails = [
            'basic_info' => $user,
            'activity_summary' => $this->getUserActivitySummary($userId),
            'health_data' => $this->getUserHealthData($userId),
            'engagement_metrics' => $this->getUserEngagementMetrics($userId),
            'recent_activities' => $this->getUserRecentActivities($userId),
        ];

        return response()->json($userDetails);
    }

    public function bulkUserActions(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'action' => 'required|in:activate,deactivate,delete,change_role,export',
            'role' => 'required_if:action,change_role|in:patient,doctor,nutritionist,coach,family,admin',
        ]);

        $users = User::whereIn('id', $request->user_ids);
        $action = $request->action;

        switch ($action) {
            case 'activate':
                $users->update(['is_active' => true]);
                $message = 'Users activated successfully';
                break;
            case 'deactivate':
                $users->update(['is_active' => false]);
                $message = 'Users deactivated successfully';
                break;
            case 'delete':
                $users->delete();
                $message = 'Users deleted successfully';
                break;
            case 'change_role':
                $users->update(['role' => $request->role]);
                $message = 'User roles updated successfully';
                break;
            case 'export':
                return $this->exportUsers($request->user_ids);
        }

        return response()->json(['message' => $message]);
    }

    public function systemAnalytics(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->subDays(30));
        $dateTo = $request->get('date_to', now());

        $analytics = [
            'user_growth' => $this->getUserGrowthTrend($dateFrom, $dateTo),
            'activity_trends' => $this->getActivityTrends($dateFrom, $dateTo),
            'role_distribution' => $this->getRoleDistribution(),
            'geographic_distribution' => $this->getGeographicDistribution(),
            'device_usage' => $this->getDeviceUsageStats(),
            'feature_adoption' => $this->getFeatureAdoptionRates(),
            'retention_metrics' => $this->getRetentionMetrics($dateFrom, $dateTo),
        ];

        return response()->json($analytics);
    }

    public function contentModeration(Request $request)
    {
        $query = Post::with(['user', 'comments']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('flagged')) {
            $query->where('is_flagged', $request->boolean('flagged'));
        }

        $posts = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 20));

        return response()->json($posts);
    }

    public function moderateContent(Request $request, $postId)
    {
        $request->validate([
            'action' => 'required|in:approve,reject,flag,delete',
            'reason' => 'required_if:action,reject,flag|string|max:500',
        ]);

        $post = Post::findOrFail($postId);
        $action = $request->action;

        switch ($action) {
            case 'approve':
                $post->update(['status' => 'approved', 'is_flagged' => false]);
                $message = 'Post approved successfully';
                break;
            case 'reject':
                $post->update(['status' => 'rejected', 'rejection_reason' => $request->reason]);
                $message = 'Post rejected successfully';
                break;
            case 'flag':
                $post->update(['is_flagged' => true, 'flag_reason' => $request->reason]);
                $message = 'Post flagged for review';
                break;
            case 'delete':
                $post->delete();
                $message = 'Post deleted successfully';
                break;
        }

        return response()->json(['message' => $message]);
    }

    public function systemHealth(Request $request)
    {
        $health = [
            'database' => $this->checkDatabaseHealth(),
            'cache' => $this->checkCacheHealth(),
            'storage' => $this->checkStorageHealth(),
            'performance' => $this->checkPerformanceMetrics(),
            'errors' => $this->getRecentErrors(),
            'recommendations' => $this->getSystemRecommendations(),
        ];

        return response()->json($health);
    }

    public function exportData(Request $request)
    {
        $request->validate([
            'data_type' => 'required|in:users,glucose_readings,nutrition_logs,workout_logs,surveys,challenges',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
            'format' => 'required|in:json,csv',
        ]);

        $dataType = $request->data_type;
        $dateFrom = $request->date_from;
        $dateTo = $request->date_to;

        $data = $this->exportDataType($dataType, $dateFrom, $dateTo);

        if ($request->format === 'csv') {
            return $this->convertToCsv($data, $dataType);
        }

        return response()->json($data);
    }

    // New endpoints for users list and counts/statistics
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = (int) $request->get('per_page', 20);
        $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($users);
    }

    public function userCounts(Request $request)
    {
        return response()->json([
            'total' => User::count(),
            'active' => User::where('is_active', true)->count(),
            'inactive' => User::where('is_active', false)->count(),
        ]);
    }

    public function roleCounts(Request $request)
    {
        $roles = ['patient', 'child', 'doctor', 'nutritionist', 'coach', 'family', 'admin'];
        $counts = [];
        foreach ($roles as $role) {
            $counts[$role] = User::where('role', $role)->count();
        }

        return response()->json($counts);
    }

    public function globalStats(Request $request)
    {
        $stats = [
            'users' => [
                'total' => User::count(),
                'active' => User::where('is_active', true)->count(),
            ],
            'roles' => User::select('role', DB::raw('COUNT(*) as count'))->groupBy('role')->get(),
            'surveys' => [
                'total' => Survey::count(),
            ],
            'challenges' => [
                'total' => Challenge::count(),
            ],
            'community' => [
                'posts' => Post::count(),
                'messages' => Message::count(),
            ],
            'health' => [
                'glucose_readings' => GlucoseReading::count(),
                'nutrition_logs' => NutritionLog::count(),
                'workout_logs' => WorkoutLog::count(),
            ],
        ];

        return response()->json($stats);
    }

    // Private helper methods
    private function getSystemStats($dateFrom, $dateTo)
    {
        return [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'new_users_this_period' => User::whereBetween('created_at', [$dateFrom, $dateTo])->count(),
            'total_surveys' => Survey::count(),
            'total_challenges' => Challenge::count(),
            'total_posts' => Post::count(),
            'total_messages' => Message::count(),
        ];
    }

    private function getUserStats($dateFrom, $dateTo)
    {
        return [
            'role_distribution' => User::select('role', DB::raw('COUNT(*) as count'))
                ->groupBy('role')
                ->get(),
            'age_distribution' => User::select(
                DB::raw('CASE 
                    WHEN age < 18 THEN "Under 18"
                    WHEN age BETWEEN 18 AND 30 THEN "18-30"
                    WHEN age BETWEEN 31 AND 50 THEN "31-50"
                    WHEN age BETWEEN 51 AND 65 THEN "51-65"
                    ELSE "Over 65"
                END as age_group'), 
                DB::raw('COUNT(*) as count')
            )->groupBy('age_group')->get(),
            'gender_distribution' => User::select('gender', DB::raw('COUNT(*) as count'))
                ->groupBy('gender')
                ->get(),
            'registration_trend' => User::select(
                DB::raw('DATE(created_at) as date'), 
                DB::raw('COUNT(*) as count')
            )->whereBetween('created_at', [$dateFrom, $dateTo])
             ->groupBy('date')
             ->orderBy('date')
             ->get(),
        ];
    }

    private function getEngagementStats($dateFrom, $dateTo)
    {
        return [
            'glucose_readings' => GlucoseReading::whereBetween('created_at', [$dateFrom, $dateTo])->count(),
            'nutrition_logs' => NutritionLog::whereBetween('created_at', [$dateFrom, $dateTo])->count(),
            'workout_logs' => WorkoutLog::whereBetween('created_at', [$dateFrom, $dateTo])->count(),
            'survey_responses' => DB::table('survey_answers')
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->count(),
            'challenge_participation' => DB::table('challenge_entries')
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->count(),
            'community_posts' => Post::whereBetween('created_at', [$dateFrom, $dateTo])->count(),
        ];
    }

    private function getHealthStats($dateFrom, $dateTo)
    {
        return [
            'average_glucose' => GlucoseReading::whereBetween('created_at', [$dateFrom, $dateTo])
                ->avg('reading'),
            'glucose_range' => [
                'min' => GlucoseReading::whereBetween('created_at', [$dateFrom, $dateTo])->min('reading'),
                'max' => GlucoseReading::whereBetween('created_at', [$dateFrom, $dateTo])->max('reading'),
            ],
            'nutrition_compliance' => $this->calculateNutritionCompliance($dateFrom, $dateTo),
            'exercise_adherence' => $this->calculateExerciseAdherence($dateFrom, $dateTo),
        ];
    }

    private function getRecentActivities()
    {
        return [
            'recent_users' => User::latest()->limit(5)->get(['id', 'name', 'email', 'created_at']),
            'recent_posts' => Post::with('user')->latest()->limit(5)->get(),
            'recent_surveys' => Survey::latest()->limit(5)->get(),
            'recent_challenges' => Challenge::latest()->limit(5)->get(),
        ];
    }

    private function getSystemHealth()
    {
        return [
            'database_connections' => DB::connection()->getPdo() ? 'Healthy' : 'Unhealthy',
            'cache_status' => Cache::has('health_check') ? 'Healthy' : 'Unhealthy',
            'storage_space' => $this->getStorageSpace(),
            'last_backup' => $this->getLastBackupTime(),
        ];
    }

    private function getUserActivitySummary($userId)
    {
        return [
            'glucose_readings_count' => GlucoseReading::where('patient_id', $userId)->count(),
            'nutrition_logs_count' => NutritionLog::where('patient_id', $userId)->count(),
            'workout_logs_count' => WorkoutLog::where('patient_id', $userId)->count(),
            'last_activity' => $this->getUserLastActivity($userId),
            'engagement_score' => $this->calculateUserEngagementScore($userId),
        ];
    }

    private function getUserHealthData($userId)
    {
        return [
            'glucose_trend' => GlucoseReading::where('patient_id', $userId)
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(['reading', 'created_at']),
            'nutrition_summary' => NutritionLog::where('patient_id', $userId)
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->limit(7)
                ->get(),
            'workout_summary' => WorkoutLog::where('patient_id', $userId)
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->limit(7)
                ->get(),
        ];
    }

    private function getUserEngagementMetrics($userId)
    {
        return [
            'login_frequency' => $this->calculateLoginFrequency($userId),
            'feature_usage' => $this->getFeatureUsage($userId),
            'community_participation' => Post::where('user_id', $userId)->count(),
            'goal_completion_rate' => $this->calculateGoalCompletionRate($userId),
        ];
    }

    private function getUserRecentActivities($userId)
    {
        return [
            'recent_glucose_readings' => GlucoseReading::where('patient_id', $userId)
                ->latest()
                ->limit(5)
                ->get(),
            'recent_nutrition_logs' => NutritionLog::where('patient_id', $userId)
                ->latest()
                ->limit(5)
                ->get(),
            'recent_workout_logs' => WorkoutLog::where('patient_id', $userId)
                ->latest()
                ->limit(5)
                ->get(),
        ];
    }

    private function exportUsers($userIds)
    {
        $users = User::whereIn('id', $userIds)->with('profile')->get();

        $exportData = $users->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'age' => $user->age,
                'gender' => $user->gender,
                'phone' => $user->phone,
                'is_active' => $user->is_active,
                'created_at' => $user->created_at,
                'last_login' => $user->last_login_at ?? 'Never',
            ];
        });

        return response()->json($exportData);
    }

    private function exportDataType($dataType, $dateFrom, $dateTo)
    {
        $query = null;

        switch ($dataType) {
            case 'users':
                $query = User::with('profile');
                break;
            case 'glucose_readings':
                $query = GlucoseReading::with('patient');
                break;
            case 'nutrition_logs':
                $query = NutritionLog::with('patient');
                break;
            case 'workout_logs':
                $query = WorkoutLog::with('patient');
                break;
            case 'surveys':
                $query = Survey::with('questions');
                break;
            case 'challenges':
                $query = Challenge::with('entries');
                break;
        }

        if ($dateFrom && $dateTo) {
            $query->whereBetween('created_at', [$dateFrom, $dateTo]);
        }

        return $query->get();
    }

    private function convertToCsv($data, $dataType)
    {
        // Implementation for CSV conversion would go here
        // For now, returning JSON with a note
        return response()->json([
            'message' => 'CSV export not yet implemented',
            'data' => $data,
            'type' => $dataType
        ]);
    }

    // Additional helper methods with placeholder implementations
    private function calculateNutritionCompliance($dateFrom, $dateTo) { return 75.5; }
    private function calculateExerciseAdherence($dateFrom, $dateTo) { return 68.2; }
    private function getStorageSpace() { return '2.5 GB / 10 GB'; }
    private function getLastBackupTime() { return now()->subHours(6); }
    private function getUserLastActivity($userId) { return now()->subHours(2); }
    private function calculateUserEngagementScore($userId) { return 82.5; }
    private function calculateLoginFrequency($userId) { return 'Daily'; }
    private function getFeatureUsage($userId) { return ['glucose_tracking' => 90, 'nutrition' => 75, 'exercise' => 60]; }
    private function calculateGoalCompletionRate($userId) { return 78.3; }
    private function getUserGrowthTrend($dateFrom, $dateTo) { return []; }
    private function getActivityTrends($dateFrom, $dateTo) { return []; }
    private function getRoleDistribution() { return []; }
    private function getGeographicDistribution() { return []; }
    private function getDeviceUsageStats() { return []; }
    private function getFeatureAdoptionRates() { return []; }
    private function getRetentionMetrics($dateFrom, $dateTo) { return []; }
    private function checkDatabaseHealth() { return 'Healthy'; }
    private function checkCacheHealth() { return 'Healthy'; }
    private function checkStorageHealth() { return 'Healthy'; }
    private function checkPerformanceMetrics() { return []; }
    private function getRecentErrors() { return []; }
    private function getSystemRecommendations() { return []; }
}
