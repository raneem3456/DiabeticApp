<?php

namespace App\Http\Controllers;

use App\Models\GlucoseReading;
use App\Models\NutritionLog;
use App\Models\WorkoutLog;
use App\Models\Mood;
use App\Models\Hba1cReport;
use App\Models\ChallengeEntry;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChildController extends Controller
{
    /**
     * Get child's glucose readings (read-only for children)
     */
    public function glucoseReadings(Request $request): JsonResponse
    {
        $readings = GlucoseReading::where('patient_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $readings->items(),
            'meta' => [
                'current_page' => $readings->currentPage(),
                'last_page' => $readings->lastPage(),
                'per_page' => $readings->perPage(),
                'total' => $readings->total(),
            ]
        ]);
    }

    /**
     * Create a new glucose reading (children can create but not edit/delete)
     */
    public function createGlucoseReading(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'value' => 'required|numeric|min:0|max:1000',
            'unit' => 'required|in:mg/dL,mmol/L',
            'source' => 'required|in:finger_prick,continuous_monitor,lab_test',
            'meal_context' => 'nullable|in:fasting,pre_meal,post_meal,before_sleep',
            'notes' => 'nullable|string|max:500',
        ]);

        $reading = GlucoseReading::create([
            'patient_id' => $request->user()->id,
            ...$validated
        ]);

        return response()->json([
            'message' => 'Glucose reading recorded successfully',
            'data' => $reading
        ], 201);
    }

    /**
     * Get child's nutrition logs (read-only)
     */
    public function nutritionLogs(Request $request): JsonResponse
    {
        $logs = NutritionLog::where('patient_id', $request->user()->id)
            ->with('meal')
            ->orderBy('consumed_at', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ]
        ]);
    }

    /**
     * Get child's workout logs (read-only)
     */
    public function workoutLogs(Request $request): JsonResponse
    {
        $logs = WorkoutLog::where('patient_id', $request->user()->id)
            ->with('exercise')
            ->orderBy('completed_at', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ]
        ]);
    }

    /**
     * Get child's mood entries (read-only)
     */
    public function moods(Request $request): JsonResponse
    {
        $moods = Mood::where('patient_id', $request->user()->id)
            ->orderBy('recorded_at', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $moods->items(),
            'meta' => [
                'current_page' => $moods->currentPage(),
                'last_page' => $moods->lastPage(),
                'per_page' => $moods->perPage(),
                'total' => $moods->total(),
            ]
        ]);
    }

    /**
     * Get child's HbA1c reports (read-only)
     */
    public function hba1cReports(Request $request): JsonResponse
    {
        $reports = Hba1cReport::where('patient_id', $request->user()->id)
            ->orderBy('test_date', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $reports->items(),
            'meta' => [
                'current_page' => $reports->currentPage(),
                'last_page' => $reports->lastPage(),
                'per_page' => $reports->perPage(),
                'total' => $reports->total(),
            ]
        ]);
    }

    /**
     * Get child's challenge entries (read-only)
     */
    public function challengeEntries(Request $request): JsonResponse
    {
        $entries = ChallengeEntry::where('patient_id', $request->user()->id)
            ->with('challenge')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $entries->items(),
            'meta' => [
                'current_page' => $entries->currentPage(),
                'last_page' => $entries->lastPage(),
                'per_page' => $entries->perPage(),
                'total' => $entries->total(),
            ]
        ]);
    }

    /**
     * Get child's profile (read-only)
     */
    public function profile(Request $request): JsonResponse
    {
        $profile = Profile::where('user_id', $request->user()->id)->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Profile not found'
            ], 404);
        }

        return response()->json([
            'data' => $profile
        ]);
    }

    /**
     * Get child's dashboard summary
     */
    public function dashboard(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $summary = [
            'glucose_readings_count' => GlucoseReading::where('patient_id', $userId)->count(),
            'nutrition_logs_count' => NutritionLog::where('patient_id', $userId)->count(),
            'workout_logs_count' => WorkoutLog::where('patient_id', $userId)->count(),
            'moods_count' => Mood::where('patient_id', $userId)->count(),
            'hba1c_reports_count' => Hba1cReport::where('patient_id', $userId)->count(),
            'challenge_entries_count' => ChallengeEntry::where('patient_id', $userId)->count(),
            'recent_glucose_reading' => GlucoseReading::where('patient_id', $userId)
                ->latest()
                ->first(['value', 'unit', 'created_at']),
            'recent_mood' => Mood::where('patient_id', $userId)
                ->latest()
                ->first(['mood_level', 'recorded_at']),
        ];

        return response()->json([
            'data' => $summary
        ]);
    }
}
