<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\GlucoseReading;
use App\Models\NutritionLog;
use App\Models\WorkoutLog;
use App\Models\Mood;
use App\Models\Hba1cReport;
use App\Models\ChallengeEntry;
use App\Models\Medication;
use App\Models\DoctorNote;
use App\Models\MealPlan;
use App\Models\WorkoutPlan;
use App\Models\EmergencyContact;
use App\Models\EmergencyAlert;
use App\Models\FamilyLink;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FamilyController extends Controller
{
    /**
     * Get all linked patients for the family member
     */
    public function linkedPatients(Request $request): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        $patients = FamilyLink::where('family_user_id', $familyMemberId)
            ->with(['patient.profile', 'patient'])
            ->get()
            ->map(function ($link) {
                return [
                    'patient_id' => $link->patient_id,
                    'patient_name' => $link->patient->name,
                    'relation' => $link->relation,
                    'is_primary_contact' => $link->is_primary_contact,
                    'can_view_medical_data' => $link->can_view_medical_data,
                    'can_receive_alerts' => $link->can_receive_alerts,
                    'profile' => $link->patient->profile,
                ];
            });

        return response()->json([
            'data' => $patients
        ]);
    }

    /**
     * Get patient overview for family member
     */
    public function patientOverview(Request $request, $patientId): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        // Check if family member has access to this patient
        $familyLink = FamilyLink::where('family_user_id', $familyMemberId)
            ->where('patient_id', $patientId)
            ->where('can_view_medical_data', true)
            ->first();

        if (!$familyLink) {
            return response()->json([
                'message' => 'Access denied to patient data'
            ], 403);
        }

        $patient = User::with('profile')->find($patientId);
        
        $overview = [
            'patient' => [
                'id' => $patient->id,
                'name' => $patient->name,
                'age' => $patient->age,
                'gender' => $patient->gender,
                'profile' => $patient->profile,
            ],
            'recent_activity' => [
                'last_glucose_reading' => GlucoseReading::where('patient_id', $patientId)
                    ->latest()
                    ->first(['value', 'unit', 'created_at']),
                'last_mood' => Mood::where('patient_id', $patientId)
                    ->latest()
                    ->first(['mood_level', 'recorded_at']),
                'last_nutrition_log' => NutritionLog::where('patient_id', $patientId)
                    ->with('meal')
                    ->latest()
                    ->first(['consumed_at', 'meal_id']),
                'last_workout_log' => WorkoutLog::where('patient_id', $patientId)
                    ->with('exercise')
                    ->latest()
                    ->first(['completed_at', 'exercise_id']),
            ],
            'counts' => [
                'glucose_readings' => GlucoseReading::where('patient_id', $patientId)->count(),
                'nutrition_logs' => NutritionLog::where('patient_id', $patientId)->count(),
                'workout_logs' => WorkoutLog::where('patient_id', $patientId)->count(),
                'moods' => Mood::where('patient_id', $patientId)->count(),
                'hba1c_reports' => Hba1cReport::where('patient_id', $patientId)->count(),
                'challenge_entries' => ChallengeEntry::where('patient_id', $patientId)->count(),
                'medications' => Medication::where('patient_id', $patientId)->count(),
                'doctor_notes' => DoctorNote::where('patient_id', $patientId)->count(),
            ]
        ];

        return response()->json([
            'data' => $overview
        ]);
    }

    /**
     * Get patient's glucose readings
     */
    public function patientGlucoseReadings(Request $request, $patientId): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        $familyLink = FamilyLink::where('family_user_id', $familyMemberId)
            ->where('patient_id', $patientId)
            ->where('can_view_medical_data', true)
            ->first();

        if (!$familyLink) {
            return response()->json([
                'message' => 'Access denied to patient data'
            ], 403);
        }

        $readings = GlucoseReading::where('patient_id', $patientId)
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
     * Get patient's nutrition logs
     */
    public function patientNutritionLogs(Request $request, $patientId): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        $familyLink = FamilyLink::where('family_user_id', $familyMemberId)
            ->where('patient_id', $patientId)
            ->where('can_view_medical_data', true)
            ->first();

        if (!$familyLink) {
            return response()->json([
                'message' => 'Access denied to patient data'
            ], 403);
        }

        $logs = NutritionLog::where('patient_id', $patientId)
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
     * Get patient's workout logs
     */
    public function patientWorkoutLogs(Request $request, $patientId): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        $familyLink = FamilyLink::where('family_user_id', $familyMemberId)
            ->where('patient_id', $patientId)
            ->where('can_view_medical_data', true)
            ->first();

        if (!$familyLink) {
            return response()->json([
                'message' => 'Access denied to patient data'
            ], 403);
        }

        $logs = WorkoutLog::where('patient_id', $patientId)
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
     * Get patient's medications
     */
    public function patientMedications(Request $request, $patientId): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        $familyLink = FamilyLink::where('family_user_id', $familyMemberId)
            ->where('patient_id', $patientId)
            ->where('can_view_medical_data', true)
            ->first();

        if (!$familyLink) {
            return response()->json([
                'message' => 'Access denied to patient data'
            ], 403);
        }

        $medications = Medication::where('patient_id', $patientId)
            ->orderBy('start_date', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $medications->items(),
            'meta' => [
                'current_page' => $medications->currentPage(),
                'last_page' => $medications->lastPage(),
                'per_page' => $medications->perPage(),
                'total' => $medications->total(),
            ]
        ]);
    }

    /**
     * Get patient's doctor notes
     */
    public function patientDoctorNotes(Request $request, $patientId): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        $familyLink = FamilyLink::where('family_user_id', $familyMemberId)
            ->where('patient_id', $patientId)
            ->where('can_view_medical_data', true)
            ->first();

        if (!$familyLink) {
            return response()->json([
                'message' => 'Access denied to patient data'
            ], 403);
        }

        $notes = DoctorNote::where('patient_id', $patientId)
            ->where('is_private', false) // Only non-private notes
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $notes->items(),
            'meta' => [
                'current_page' => $notes->currentPage(),
                'last_page' => $notes->lastPage(),
                'per_page' => $notes->perPage(),
                'total' => $notes->total(),
            ]
        ]);
    }

    /**
     * Get patient's meal plans
     */
    public function patientMealPlans(Request $request, $patientId): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        $familyLink = FamilyLink::where('family_user_id', $familyMemberId)
            ->where('patient_id', $patientId)
            ->where('can_view_medical_data', true)
            ->first();

        if (!$familyLink) {
            return response()->json([
                'message' => 'Access denied to patient data'
            ], 403);
        }

        $mealPlans = MealPlan::where('patient_id', $patientId)
            ->where('is_active', true)
            ->orderBy('start_date', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $mealPlans->items(),
            'meta' => [
                'current_page' => $mealPlans->currentPage(),
                'last_page' => $mealPlans->lastPage(),
                'per_page' => $mealPlans->perPage(),
                'total' => $mealPlans->total(),
            ]
        ]);
    }

    /**
     * Get patient's workout plans
     */
    public function patientWorkoutPlans(Request $request, $patientId): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        $familyLink = FamilyLink::where('family_user_id', $familyMemberId)
            ->where('patient_id', $patientId)
            ->where('can_view_medical_data', true)
            ->first();

        if (!$familyLink) {
            return response()->json([
                'message' => 'Access denied to patient data'
            ], 403);
        }

        $workoutPlans = WorkoutPlan::where('patient_id', $patientId)
            ->where('is_active', true)
            ->orderBy('start_date', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $workoutPlans->items(),
            'meta' => [
                'current_page' => $workoutPlans->currentPage(),
                'last_page' => $workoutPlans->lastPage(),
                'per_page' => $workoutPlans->perPage(),
                'total' => $workoutPlans->total(),
            ]
        ]);
    }

    /**
     * Create emergency contact for patient
     */
    public function createEmergencyContact(Request $request, $patientId): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        $familyLink = FamilyLink::where('family_user_id', $familyMemberId)
            ->where('patient_id', $patientId)
            ->first();

        if (!$familyLink) {
            return response()->json([
                'message' => 'Access denied to patient data'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'relationship' => 'required|string|max:100',
            'is_primary' => 'boolean',
            'can_receive_alerts' => 'boolean',
        ]);

        $contact = EmergencyContact::create([
            'patient_id' => $patientId,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'relationship' => $validated['relationship'],
            'is_primary' => $validated['is_primary'] ?? false,
            'can_receive_alerts' => $validated['can_receive_alerts'] ?? true,
        ]);

        return response()->json([
            'message' => 'Emergency contact created successfully',
            'data' => $contact
        ], 201);
    }

    /**
     * Get patient's emergency alerts
     */
    public function patientEmergencyAlerts(Request $request, $patientId): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        $familyLink = FamilyLink::where('family_user_id', $familyMemberId)
            ->where('patient_id', $patientId)
            ->where('can_receive_alerts', true)
            ->first();

        if (!$familyLink) {
            return response()->json([
                'message' => 'Access denied to patient alerts'
            ], 403);
        }

        $alerts = EmergencyAlert::where('patient_id', $patientId)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $alerts->items(),
            'meta' => [
                'current_page' => $alerts->currentPage(),
                'last_page' => $alerts->lastPage(),
                'per_page' => $alerts->perPage(),
                'total' => $alerts->total(),
            ]
        ]);
    }

    /**
     * Acknowledge emergency alert
     */
    public function acknowledgeAlert(Request $request, $patientId, $alertId): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        $familyLink = FamilyLink::where('family_user_id', $familyMemberId)
            ->where('patient_id', $patientId)
            ->where('can_receive_alerts', true)
            ->first();

        if (!$familyLink) {
            return response()->json([
                'message' => 'Access denied to patient alerts'
            ], 403);
        }

        $alert = EmergencyAlert::where('id', $alertId)
            ->where('patient_id', $patientId)
            ->first();

        if (!$alert) {
            return response()->json([
                'message' => 'Alert not found'
            ], 404);
        }

        $alert->update([
            'acknowledged_at' => now(),
            'acknowledged_by' => $familyMemberId,
        ]);

        return response()->json([
            'message' => 'Alert acknowledged successfully',
            'data' => $alert
        ]);
    }

    /**
     * Get family dashboard with overview of all linked patients
     */
    public function dashboard(Request $request): JsonResponse
    {
        $familyMemberId = $request->user()->id;
        
        $familyLinks = FamilyLink::where('family_user_id', $familyMemberId)
            ->with(['patient.profile'])
            ->get();

        $dashboard = [
            'linked_patients_count' => $familyLinks->count(),
            'patients' => $familyLinks->map(function ($link) {
                $patientId = $link->patient_id;
                
                return [
                    'patient_id' => $patientId,
                    'patient_name' => $link->patient->name,
                    'relation' => $link->relation,
                    'recent_activity' => [
                        'last_glucose_reading' => GlucoseReading::where('patient_id', $patientId)
                            ->latest()
                            ->first(['value', 'unit', 'created_at']),
                        'last_mood' => Mood::where('patient_id', $patientId)
                            ->latest()
                            ->first(['mood_level', 'recorded_at']),
                    ],
                    'counts' => [
                        'glucose_readings' => GlucoseReading::where('patient_id', $patientId)->count(),
                        'nutrition_logs' => NutritionLog::where('patient_id', $patientId)->count(),
                        'workout_logs' => WorkoutLog::where('patient_id', $patientId)->count(),
                        'medications' => Medication::where('patient_id', $patientId)->count(),
                    ]
                ];
            }),
            'recent_alerts' => EmergencyAlert::whereIn('patient_id', $familyLinks->pluck('patient_id'))
                ->where('can_receive_alerts', true)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(['id', 'patient_id', 'alert_type', 'severity', 'message', 'created_at']),
        ];

        return response()->json([
            'data' => $dashboard
        ]);
    }
}
