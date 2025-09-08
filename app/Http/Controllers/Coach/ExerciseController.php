<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    public function index(Request $request)
    {
        $exercises = Exercise::orderBy('name')
            ->paginate(20);

        return response()->json($exercises);
    }

    public function show(Request $request, Exercise $exercise)
    {
        return response()->json($exercise);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level' => 'required|in:beginner,intermediate,advanced',
            'type' => 'required|in:cardio,strength,flexibility,balance',
            'equipment' => 'required|in:none,dumbbells,resistance_band,yoga_mat,other',
            'duration_minutes' => 'nullable|integer|min:0',
            'sets' => 'nullable|integer|min:0',
            'reps' => 'nullable|integer|min:0',
            'video_url' => 'nullable|url',
            'image_url' => 'nullable|url',
            'instructions' => 'nullable|string',
            'safety_notes' => 'nullable|string',
        ]);

        $exercise = Exercise::create($request->all());

        return response()->json($exercise, 201);
    }

    public function update(Request $request, Exercise $exercise)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'level' => 'sometimes|required|in:beginner,intermediate,advanced',
            'type' => 'sometimes|required|in:cardio,strength,flexibility,balance',
            'equipment' => 'sometimes|required|in:none,dumbbells,resistance_band,yoga_mat,other',
            'duration_minutes' => 'nullable|integer|min:0',
            'sets' => 'nullable|integer|min:0',
            'reps' => 'nullable|integer|min:0',
            'video_url' => 'nullable|url',
            'image_url' => 'nullable|url',
            'instructions' => 'nullable|string',
            'safety_notes' => 'nullable|string',
        ]);

        $exercise->update($request->all());

        return response()->json($exercise);
    }

    public function destroy(Request $request, Exercise $exercise)
    {
        $exercise->delete();

        return response()->json(['message' => 'Exercise deleted successfully']);
    }
}
