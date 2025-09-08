<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserPoints;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UserPointController extends Controller
{
    public function index(Request $request)
    {
        $query = UserPoints::with('user');

        // Advanced filtering
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('activity_type') && $request->activity_type !== 'all') {
            $query->where('activity_type', $request->activity_type);
        }

        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        if ($request->has('points_min')) {
            $query->where('points', '>=', $request->points_min);
        }

        if ($request->has('points_max')) {
            $query->where('points', '<=', $request->points_max);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $userPoints = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15));

        return response()->json($userPoints);
    }

    public function show(Request $request, UserPoints $userPoint)
    {
        $this->authorize('view', $userPoint);
        return response()->json($userPoint->load('user'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'points' => 'required|integer',
            'activity_type' => ['required', Rule::in([
                'glucose_tracking', 'exercise', 'nutrition', 'medication', 'survey_completion',
                'challenge_completion', 'community_engagement', 'goal_achievement', 'streak_maintenance',
                'admin_award', 'referral', 'daily_login', 'profile_completion', 'other'
            ])],
            'description' => 'nullable|string|max:500',
            'reference_type' => 'nullable|string|max:100',
            'reference_id' => 'nullable|integer',
            'expires_at' => 'nullable|date|after:now',
            'is_bonus' => 'boolean',
            'multiplier' => 'nullable|numeric|min:0.1|max:10',
        ]);

        $userPoint = UserPoints::create([
            'user_id' => $request->user_id,
            'points' => $request->points,
            'activity_type' => $request->activity_type,
            'description' => $request->description,
            'reference_type' => $request->reference_type,
            'reference_id' => $request->reference_id,
            'expires_at' => $request->expires_at,
            'is_bonus' => $request->boolean('is_bonus', false),
            'multiplier' => $request->multiplier ?? 1.0,
        ]);

        return response()->json($userPoint->load('user'), 201);
    }

    public function update(Request $request, UserPoints $userPoint)
    {
        $this->authorize('update', $userPoint);

        $request->validate([
            'points' => 'sometimes|required|integer',
            'activity_type' => ['sometimes', 'required', Rule::in([
                'glucose_tracking', 'exercise', 'nutrition', 'medication', 'survey_completion',
                'challenge_completion', 'community_engagement', 'goal_achievement', 'streak_maintenance',
                'admin_award', 'referral', 'daily_login', 'profile_completion', 'other'
            ])],
            'description' => 'nullable|string|max:500',
            'reference_type' => 'nullable|string|max:100',
            'reference_id' => 'nullable|integer',
            'expires_at' => 'nullable|date|after:now',
            'is_bonus' => 'boolean',
            'multiplier' => 'nullable|numeric|min:0.1|max:10',
        ]);

        $userPoint->update($request->only([
            'points', 'activity_type', 'description', 'reference_type', 
            'reference_id', 'expires_at', 'is_bonus', 'multiplier'
        ]));

        return response()->json($userPoint->load('user'));
    }

    public function destroy(Request $request, UserPoints $userPoint)
    {
        $this->authorize('delete', $userPoint);
        $userPoint->delete();

        return response()->json(['message' => 'User points record deleted successfully']);
    }

    public function userTotal(Request $request, $userId)
    {
        $total = UserPoints::where('user_id', $userId)
            ->where(function($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->sum('points');
        
        return response()->json([
            'user_id' => $userId,
            'total_points' => $total
        ]);
    }

    // New enhanced methods

    public function bulkAward(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'points' => 'required|integer',
            'activity_type' => ['required', Rule::in([
                'glucose_tracking', 'exercise', 'nutrition', 'medication', 'survey_completion',
                'challenge_completion', 'community_engagement', 'goal_achievement', 'streak_maintenance',
                'admin_award', 'referral', 'daily_login', 'profile_completion', 'other'
            ])],
            'description' => 'nullable|string|max:500',
            'is_bonus' => 'boolean',
            'multiplier' => 'nullable|numeric|min:0.1|max:10',
        ]);

        $awardedPoints = [];
        foreach ($request->user_ids as $userId) {
            $awardedPoints[] = UserPoints::create([
                'user_id' => $userId,
                'points' => $request->points,
                'activity_type' => $request->activity_type,
                'description' => $request->description,
                'is_bonus' => $request->boolean('is_bonus', false),
                'multiplier' => $request->multiplier ?? 1.0,
            ]);
        }

        return response()->json([
            'message' => 'Points awarded successfully to ' . count($awardedPoints) . ' users',
            'awarded_points' => $awardedPoints
        ], 201);
    }

    public function bulkDeduct(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'points' => 'required|integer|min:1',
            'reason' => 'required|string|max:500',
        ]);

        $deductedPoints = [];
        foreach ($request->user_ids as $userId) {
            $deductedPoints[] = UserPoints::create([
                'user_id' => $userId,
                'points' => -$request->points, // Negative points for deduction
                'activity_type' => 'admin_deduction',
                'description' => $request->reason,
                'is_bonus' => false,
                'multiplier' => 1.0,
            ]);
        }

        return response()->json([
            'message' => 'Points deducted successfully from ' . count($deductedPoints) . ' users',
            'deducted_points' => $deductedPoints
        ], 201);
    }

    public function analytics(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->subDays(30));
        $dateTo = $request->get('date_to', now());

        $analytics = [
            'total_points_awarded' => UserPoints::where('points', '>', 0)
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->sum('points'),
            'total_points_deducted' => abs(UserPoints::where('points', '<', 0)
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->sum('points')),
            'net_points_change' => UserPoints::whereBetween('created_at', [$dateFrom, $dateTo])
                ->sum('points'),
            'activity_distribution' => $this->getActivityDistribution($dateFrom, $dateTo),
            'top_earners' => $this->getTopEarners($dateFrom, $dateTo),
            'points_trend' => $this->getPointsTrend($dateFrom, $dateTo),
            'role_distribution' => $this->getRoleDistribution($dateFrom, $dateTo),
            'expiring_points' => $this->getExpiringPoints(),
        ];

        return response()->json($analytics);
    }

    public function userAnalytics(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $dateFrom = $request->get('date_from', now()->subDays(30));
        $dateTo = $request->get('date_to', now());

        $analytics = [
            'user_info' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'total_points' => $this->getUserTotalPoints($userId),
            'available_points' => $this->getUserAvailablePoints($userId),
            'expired_points' => $this->getUserExpiredPoints($userId),
            'points_by_activity' => $this->getUserPointsByActivity($userId, $dateFrom, $dateTo),
            'points_timeline' => $this->getUserPointsTimeline($userId, $dateFrom, $dateTo),
            'recent_activities' => $this->getUserRecentActivities($userId),
            'achievements' => $this->getUserAchievements($userId),
        ];

        return response()->json($analytics);
    }

    public function leaderboard(Request $request)
    {
        $query = User::with('profile')
            ->select('users.*', DB::raw('COALESCE(SUM(user_points.points), 0) as total_points'))
            ->leftJoin('user_points', 'users.id', '=', 'user_points.user_id')
            ->where(function($q) {
                $q->whereNull('user_points.expires_at')
                  ->orWhere('user_points.expires_at', '>', now());
            })
            ->groupBy('users.id')
            ->orderBy('total_points', 'desc');

        if ($request->has('role') && $request->role !== 'all') {
            $query->where('users.role', $request->role);
        }

        if ($request->has('limit')) {
            $query->limit($request->limit);
        }

        $leaderboard = $query->get();

        return response()->json($leaderboard);
    }

    public function exportUserPoints(Request $request)
    {
        $query = UserPoints::with('user');

        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        $userPoints = $query->get();

        $exportData = $userPoints->map(function($point) {
            return [
                'user_id' => $point->user_id,
                'user_name' => $point->user->name,
                'user_email' => $point->user->email,
                'points' => $point->points,
                'activity_type' => $point->activity_type,
                'description' => $point->description,
                'created_at' => $point->created_at,
                'expires_at' => $point->expires_at,
                'is_bonus' => $point->is_bonus,
                'multiplier' => $point->multiplier,
            ];
        });

        return response()->json($exportData);
    }

    private function getActivityDistribution($dateFrom, $dateTo)
    {
        return UserPoints::whereBetween('created_at', [$dateFrom, $dateTo])
            ->select('activity_type', DB::raw('COUNT(*) as count'), DB::raw('SUM(points) as total_points'))
            ->groupBy('activity_type')
            ->orderBy('total_points', 'desc')
            ->get();
    }

    private function getTopEarners($dateFrom, $dateTo, $limit = 10)
    {
        return User::select('users.*', DB::raw('COALESCE(SUM(user_points.points), 0) as total_points'))
            ->leftJoin('user_points', 'users.id', '=', 'user_points.user_id')
            ->whereBetween('user_points.created_at', [$dateFrom, $dateTo])
            ->groupBy('users.id')
            ->orderBy('total_points', 'desc')
            ->limit($limit)
            ->get();
    }

    private function getPointsTrend($dateFrom, $dateTo)
    {
        return UserPoints::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(CASE WHEN points > 0 THEN points ELSE 0 END) as points_earned'),
            DB::raw('SUM(CASE WHEN points < 0 THEN ABS(points) ELSE 0 END) as points_deducted'),
            DB::raw('SUM(points) as net_points')
        )
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    private function getRoleDistribution($dateFrom, $dateTo)
    {
        return UserPoints::join('users', 'user_points.user_id', '=', 'users.id')
            ->whereBetween('user_points.created_at', [$dateFrom, $dateTo])
            ->select('users.role', DB::raw('COUNT(*) as count'), DB::raw('SUM(user_points.points) as total_points'))
            ->groupBy('users.role')
            ->get();
    }

    private function getExpiringPoints()
    {
        return UserPoints::with('user')
            ->whereNotNull('expires_at')
            ->where('expires_at', '>', now())
            ->where('expires_at', '<=', now()->addDays(7))
            ->where('points', '>', 0)
            ->get()
            ->groupBy('user_id')
            ->map(function($points) {
                return [
                    'user' => $points->first()->user,
                    'expiring_points' => $points->sum('points'),
                    'expires_at' => $points->min('expires_at')
                ];
            });
    }

    private function getUserTotalPoints($userId)
    {
        return UserPoints::where('user_id', $userId)->sum('points');
    }

    private function getUserAvailablePoints($userId)
    {
        return UserPoints::where('user_id', $userId)
            ->where(function($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->sum('points');
    }

    private function getUserExpiredPoints($userId)
    {
        return UserPoints::where('user_id', $userId)
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->sum('points');
    }

    private function getUserPointsByActivity($userId, $dateFrom, $dateTo)
    {
        return UserPoints::where('user_id', $userId)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->select('activity_type', DB::raw('COUNT(*) as count'), DB::raw('SUM(points) as total_points'))
            ->groupBy('activity_type')
            ->get();
    }

    private function getUserPointsTimeline($userId, $dateFrom, $dateTo)
    {
        return UserPoints::where('user_id', $userId)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(points) as daily_points'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    private function getUserRecentActivities($userId, $limit = 10)
    {
        return UserPoints::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    private function getUserAchievements($userId)
    {
        // This would need to be implemented based on your achievement system
        // For now, returning a placeholder
        return [];
    }
}
