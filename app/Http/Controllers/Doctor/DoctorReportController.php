<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\MealPlan;
use App\Models\WorkoutPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DoctorReportController extends Controller
{
    public function patientStatistics(Request $request)
    {
        $patients = User::where('role', 'patient')
            ->with('profile')
            ->get();

        $statistics = [
            'total_patients' => $patients->count(),
            'by_diabetes_type' => $patients->groupBy('profile.diabetes_type')
                ->map(function($group) {
                    return $group->count();
                }),
            'by_age_group' => [
                'children' => $patients->where('age', '<', 13)->count(),
                'adults' => $patients->where('age', '>=', 13)->count(),
            ],
            'by_gender' => $patients->groupBy('gender')
                ->map(function($group) {
                    return $group->count();
                }),
            'active_patients' => $patients->where('is_active', true)->count(),
            'inactive_patients' => $patients->where('is_active', false)->count(),
        ];

        return response()->json($statistics);
    }

    public function patientMealPlans(Request $request, $patientId)
    {
        $patient = User::findOrFail($patientId);
        
        if ($patient->role !== 'patient') {
            return response()->json(['message' => 'User is not a patient'], 400);
        }

        $mealPlans = MealPlan::where('patient_id', $patientId)
            ->with(['nutritionist', 'days.meals'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'patient' => $patient->load('profile'),
            'meal_plans' => $mealPlans
        ]);
    }

    public function patientWorkoutPlans(Request $request, $patientId)
    {
        $patient = User::findOrFail($patientId);
        
        if ($patient->role !== 'patient') {
            return response()->json(['message' => 'User is not a patient'], 400);
        }

        $workoutPlans = WorkoutPlan::where('patient_id', $patientId)
            ->with(['coach', 'days.exercises'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'patient' => $patient->load('profile'),
            'workout_plans' => $workoutPlans
        ]);
    }

    public function patientOverview(Request $request, $patientId)
    {
        $patient = User::findOrFail($patientId);
        
        if ($patient->role !== 'patient') {
            return response()->json(['message' => 'User is not a patient'], 400);
        }

        $overview = [
            'patient' => $patient->load('profile'),
            'recent_glucose_readings' => $patient->glucoseReadings()
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
            'recent_hba1c_reports' => $patient->hba1cReports()
                ->orderBy('test_date', 'desc')
                ->limit(5)
                ->get(),
            'active_medications' => $patient->medications()
                ->where('is_active', true)
                ->where(function($query) {
                    $query->whereNull('end_date')
                          ->orWhere('end_date', '>=', now());
                })
                ->get(),
            'recent_doctor_notes' => $patient->doctorNotes()
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
            'current_meal_plan' => $patient->mealPlans()
                ->where('is_active', true)
                ->with(['nutritionist', 'days.meals'])
                ->first(),
            'current_workout_plan' => $patient->workoutPlans()
                ->where('is_active', true)
                ->with(['coach', 'days.exercises'])
                ->first(),
        ];

        return response()->json($overview);
    }

    public function diabetesTypeReport(Request $request)
    {
        $report = DB::table('users')
            ->join('profiles', 'users.id', '=', 'profiles.user_id')
            ->where('users.role', 'patient')
            ->select('profiles.diabetes_type', DB::raw('count(*) as patient_count'))
            ->groupBy('profiles.diabetes_type')
            ->get();

        return response()->json($report);
    }

    public function ageGroupReport(Request $request)
    {
        $report = DB::table('users')
            ->where('role', 'patient')
            ->select(
                DB::raw('CASE 
                    WHEN age < 13 THEN "children" 
                    ELSE "adults" 
                END as age_group'),
                DB::raw('count(*) as patient_count')
            )
            ->groupBy('age_group')
            ->get();

        return response()->json($report);
    }
}
