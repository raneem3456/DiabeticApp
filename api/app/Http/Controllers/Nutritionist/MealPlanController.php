<?php

namespace App\Http\Controllers\Nutritionist;

use App\Http\Controllers\Controller;
use App\Models\MealPlan;
use App\Models\User;
use Illuminate\Http\Request;

class MealPlanController extends Controller
{
    public function index(Request $request)
    {
        $plans = $request->user()->patientsAsNutritionist()
            ->with(['patient', 'nutritionist', 'mealPlanDays'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($plans);
    }

    public function show(Request $request, MealPlan $mealPlan)
    {
        $this->authorize('view', $mealPlan);

        return response()->json($mealPlan->load(['patient', 'nutritionist', 'mealPlanDays']));
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

        $plan = $request->user()->patientsAsNutritionist()->create([
            'patient_id' => $request->patient_id,
            'nutritionist_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        return response()->json($plan->load(['patient', 'nutritionist']), 201);
    }

    public function update(Request $request, MealPlan $mealPlan)
    {
        $this->authorize('update', $mealPlan);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => 'sometimes|required|in:active,inactive,completed',
        ]);

        $mealPlan->update($request->all());

        return response()->json($mealPlan->load(['patient', 'nutritionist']));
    }

    public function destroy(Request $request, MealPlan $mealPlan)
    {
        $this->authorize('delete', $mealPlan);

        $mealPlan->delete();

        return response()->json(['message' => 'Meal plan deleted successfully']);
    }

    public function patientPlans(Request $request, User $patient)
    {
        $plans = $request->user()->patientsAsNutritionist()
            ->where('patient_id', $patient->id)
            ->with(['patient', 'nutritionist', 'mealPlanDays'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($plans);
    }
}
