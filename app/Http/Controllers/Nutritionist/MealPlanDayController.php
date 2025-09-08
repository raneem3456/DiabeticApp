<?php

namespace App\Http\Controllers\Nutritionist;

use App\Http\Controllers\Controller;
use App\Models\MealPlanDay;
use Illuminate\Http\Request;

class MealPlanDayController extends Controller
{
    public function index(Request $request)
    {
        $mealPlanDays = MealPlanDay::with(['mealPlan', 'meals'])
            ->orderBy('day_number', 'asc')
            ->paginate(15);

        return response()->json($mealPlanDays);
    }

    public function show(Request $request, MealPlanDay $mealPlanDay)
    {
        $this->authorize('view', $mealPlanDay);
        return response()->json($mealPlanDay->load(['mealPlan', 'meals']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'meal_plan_id' => 'required|exists:meal_plans,id',
            'day_number' => 'required|integer|min:1|max:7',
            'day_name' => 'required|string|max:50',
            'total_calories' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        $mealPlanDay = MealPlanDay::create([
            'meal_plan_id' => $request->meal_plan_id,
            'day_number' => $request->day_number,
            'day_name' => $request->day_name,
            'total_calories' => $request->total_calories,
            'notes' => $request->notes,
        ]);

        return response()->json($mealPlanDay->load(['mealPlan', 'meals']), 201);
    }

    public function update(Request $request, MealPlanDay $mealPlanDay)
    {
        $this->authorize('update', $mealPlanDay);

        $request->validate([
            'day_number' => 'sometimes|required|integer|min:1|max:7',
            'day_name' => 'sometimes|required|string|max:50',
            'total_calories' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        $mealPlanDay->update($request->only([
            'day_number', 'day_name', 'total_calories', 'notes'
        ]));

        return response()->json($mealPlanDay->load(['mealPlan', 'meals']));
    }

    public function destroy(Request $request, MealPlanDay $mealPlanDay)
    {
        $this->authorize('delete', $mealPlanDay);
        $mealPlanDay->delete();

        return response()->json(['message' => 'Meal plan day deleted successfully']);
    }

    public function attachMeal(Request $request, MealPlanDay $mealPlanDay)
    {
        $this->authorize('update', $mealPlanDay);

        $request->validate([
            'meal_id' => 'required|exists:meals,id',
            'meal_type' => 'required|in:breakfast,lunch,dinner,snack',
        ]);

        $mealPlanDay->meals()->attach($request->meal_id, [
            'meal_type' => $request->meal_type
        ]);

        return response()->json(['message' => 'Meal attached successfully']);
    }

    public function detachMeal(Request $request, MealPlanDay $mealPlanDay)
    {
        $this->authorize('update', $mealPlanDay);

        $request->validate([
            'meal_id' => 'required|exists:meals,id',
        ]);

        $mealPlanDay->meals()->detach($request->meal_id);

        return response()->json(['message' => 'Meal detached successfully']);
    }
}
