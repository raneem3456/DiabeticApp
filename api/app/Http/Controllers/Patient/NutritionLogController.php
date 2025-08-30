<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\NutritionLog;
use Illuminate\Http\Request;

class NutritionLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = $request->user()->nutritionLogs()
            ->with('meal')
            ->orderBy('logged_at', 'desc')
            ->paginate(20);

        return response()->json($logs);
    }

    public function show(Request $request, NutritionLog $nutritionLog)
    {
        $this->authorize('view', $nutritionLog);

        return response()->json($nutritionLog->load('meal'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'meal_id' => 'nullable|exists:meals,id',
            'meal_name' => 'nullable|string|max:255',
            'carbs' => 'nullable|numeric|min:0',
            'protein' => 'nullable|numeric|min:0',
            'fat' => 'nullable|numeric|min:0',
            'kcal' => 'nullable|integer|min:0',
            'meal_type' => 'required|in:breakfast,lunch,dinner,snack',
            'notes' => 'nullable|string',
            'logged_at' => 'required|date',
        ]);

        $log = $request->user()->nutritionLogs()->create($request->all());

        return response()->json($log->load('meal'), 201);
    }

    public function update(Request $request, NutritionLog $nutritionLog)
    {
        $this->authorize('update', $nutritionLog);

        $request->validate([
            'meal_id' => 'nullable|exists:meals,id',
            'meal_name' => 'nullable|string|max:255',
            'carbs' => 'nullable|numeric|min:0',
            'protein' => 'nullable|numeric|min:0',
            'fat' => 'nullable|numeric|min:0',
            'kcal' => 'nullable|integer|min:0',
            'meal_type' => 'sometimes|required|in:breakfast,lunch,dinner,snack',
            'notes' => 'nullable|string',
            'logged_at' => 'sometimes|required|date',
        ]);

        $nutritionLog->update($request->all());

        return response()->json($nutritionLog->load('meal'));
    }

    public function destroy(Request $request, NutritionLog $nutritionLog)
    {
        $this->authorize('delete', $nutritionLog);

        $nutritionLog->delete();

        return response()->json(['message' => 'Nutrition log deleted successfully']);
    }
}
