<?php

namespace App\Http\Controllers\Nutritionist;

use App\Http\Controllers\Controller;
use App\Models\Meal;
use Illuminate\Http\Request;

class MealController extends Controller
{
    public function index(Request $request)
    {
        $meals = Meal::with('mealItems')
            ->orderBy('name')
            ->paginate(20);

        return response()->json($meals);
    }

    public function show(Request $request, Meal $meal)
    {
        return response()->json($meal->load('mealItems'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'kcal' => 'required|integer|min:0',
            'carbs' => 'required|numeric|min:0',
            'protein' => 'required|numeric|min:0',
            'fat' => 'required|numeric|min:0',
            'fiber' => 'nullable|numeric|min:0',
            'sugar' => 'nullable|numeric|min:0',
            'meal_type' => 'required|in:breakfast,lunch,dinner,snack',
            'is_vegetarian' => 'boolean',
            'is_vegan' => 'boolean',
            'is_gluten_free' => 'boolean',
            'image_url' => 'nullable|url',
        ]);

        $meal = Meal::create($request->all());

        return response()->json($meal, 201);
    }

    public function update(Request $request, Meal $meal)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'kcal' => 'sometimes|required|integer|min:0',
            'carbs' => 'sometimes|required|numeric|min:0',
            'protein' => 'sometimes|required|numeric|min:0',
            'fat' => 'sometimes|required|numeric|min:0',
            'fiber' => 'nullable|numeric|min:0',
            'sugar' => 'nullable|numeric|min:0',
            'meal_type' => 'sometimes|required|in:breakfast,lunch,dinner,snack',
            'is_vegetarian' => 'boolean',
            'is_vegan' => 'boolean',
            'is_gluten_free' => 'boolean',
            'image_url' => 'nullable|url',
        ]);

        $meal->update($request->all());

        return response()->json($meal);
    }

    public function destroy(Request $request, Meal $meal)
    {
        $meal->delete();

        return response()->json(['message' => 'Meal deleted successfully']);
    }
}
