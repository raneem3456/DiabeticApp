<?php

namespace App\Http\Controllers\Nutritionist;

use App\Http\Controllers\Controller;
use App\Models\MealItem;
use Illuminate\Http\Request;

class MealItemController extends Controller
{
    public function index(Request $request)
    {
        $mealItems = MealItem::with('meal')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($mealItems);
    }

    public function show(Request $request, MealItem $mealItem)
    {
        $this->authorize('view', $mealItem);
        return response()->json($mealItem->load('meal'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'meal_id' => 'required|exists:meals,id',
            'name' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'calories' => 'nullable|numeric|min:0',
            'protein' => 'nullable|numeric|min:0',
            'carbs' => 'nullable|numeric|min:0',
            'fat' => 'nullable|numeric|min:0',
            'fiber' => 'nullable|numeric|min:0',
            'sugar' => 'nullable|numeric|min:0',
        ]);

        $mealItem = MealItem::create([
            'meal_id' => $request->meal_id,
            'name' => $request->name,
            'quantity' => $request->quantity,
            'unit' => $request->unit,
            'calories' => $request->calories,
            'protein' => $request->protein,
            'carbs' => $request->carbs,
            'fat' => $request->fat,
            'fiber' => $request->fiber,
            'sugar' => $request->sugar,
        ]);

        return response()->json($mealItem->load('meal'), 201);
    }

    public function update(Request $request, MealItem $mealItem)
    {
        $this->authorize('update', $mealItem);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'quantity' => 'sometimes|required|numeric|min:0',
            'unit' => 'sometimes|required|string|max:50',
            'calories' => 'nullable|numeric|min:0',
            'protein' => 'nullable|numeric|min:0',
            'carbs' => 'nullable|numeric|min:0',
            'fat' => 'nullable|numeric|min:0',
            'fiber' => 'nullable|numeric|min:0',
            'sugar' => 'nullable|numeric|min:0',
        ]);

        $mealItem->update($request->only([
            'name', 'quantity', 'unit', 'calories', 'protein', 
            'carbs', 'fat', 'fiber', 'sugar'
        ]));

        return response()->json($mealItem->load('meal'));
    }

    public function destroy(Request $request, MealItem $mealItem)
    {
        $this->authorize('delete', $mealItem);
        $mealItem->delete();

        return response()->json(['message' => 'Meal item deleted successfully']);
    }
}
