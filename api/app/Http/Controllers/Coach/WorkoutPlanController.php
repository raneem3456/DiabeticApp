<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\WorkoutPlan;
use App\Models\User;
use Illuminate\Http\Request;

class WorkoutPlanController extends Controller
{
    public function index(Request $request)
    {
        $plans = $request->user()->patientsAsCoach()
            ->with(['patient', 'coach', 'workoutDays'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($plans);
    }

    public function show(Request $request, WorkoutPlan $workoutPlan)
    {
        $this->authorize('view', $workoutPlan);

        return response()->json($workoutPlan->load(['patient', 'coach', 'workoutDays']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $plan = $request->user()->patientsAsCoach()->create([
            'patient_id' => $request->patient_id,
            'coach_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        return response()->json($plan->load(['patient', 'coach']), 201);
    }

    public function update(Request $request, WorkoutPlan $workoutPlan)
    {
        $this->authorize('update', $workoutPlan);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => 'sometimes|required|in:active,inactive,completed',
        ]);

        $workoutPlan->update($request->all());

        return response()->json($workoutPlan->load(['patient', 'coach']));
    }

    public function destroy(Request $request, WorkoutPlan $workoutPlan)
    {
        $this->authorize('delete', $workoutPlan);

        $workoutPlan->delete();

        return response()->json(['message' => 'Workout plan deleted successfully']);
    }

    public function patientPlans(Request $request, User $patient)
    {
        $plans = $request->user()->patientsAsCoach()
            ->where('patient_id', $patient->id)
            ->with(['patient', 'coach', 'workoutDays'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($plans);
    }
}
