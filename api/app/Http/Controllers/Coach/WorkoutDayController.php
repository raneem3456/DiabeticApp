<?php

namespace App\Http\Controllers\Coach;

use App\Http\Controllers\Controller;
use App\Models\WorkoutDay;
use Illuminate\Http\Request;

class WorkoutDayController extends Controller
{
    public function index(Request $request)
    {
        $workoutDays = WorkoutDay::with(['workoutPlan', 'exercises'])
            ->orderBy('day_number', 'asc')
            ->paginate(15);

        return response()->json($workoutDays);
    }

    public function show(Request $request, WorkoutDay $workoutDay)
    {
        $this->authorize('view', $workoutDay);
        return response()->json($workoutDay->load(['workoutPlan', 'exercises']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'workout_plan_id' => 'required|exists:workout_plans,id',
            'day_number' => 'required|integer|min:1|max:7',
            'day_name' => 'required|string|max:50',
            'rest_day' => 'boolean',
            'notes' => 'nullable|string|max:1000',
        ]);

        $workoutDay = WorkoutDay::create([
            'workout_plan_id' => $request->workout_plan_id,
            'day_number' => $request->day_number,
            'day_name' => $request->day_name,
            'rest_day' => $request->rest_day ?? false,
            'notes' => $request->notes,
        ]);

        return response()->json($workoutDay->load(['workoutPlan', 'exercises']), 201);
    }

    public function update(Request $request, WorkoutDay $workoutDay)
    {
        $this->authorize('update', $workoutDay);

        $request->validate([
            'day_number' => 'sometimes|required|integer|min:1|max:7',
            'day_name' => 'sometimes|required|string|max:50',
            'rest_day' => 'boolean',
            'notes' => 'nullable|string|max:1000',
        ]);

        $workoutDay->update($request->only([
            'day_number', 'day_name', 'rest_day', 'notes'
        ]));

        return response()->json($workoutDay->load(['workoutPlan', 'exercises']));
    }

    public function destroy(Request $request, WorkoutDay $workoutDay)
    {
        $this->authorize('delete', $workoutDay);
        $workoutDay->delete();

        return response()->json(['message' => 'Workout day deleted successfully']);
    }

    public function attachExercise(Request $request, WorkoutDay $workoutDay)
    {
        $this->authorize('update', $workoutDay);

        $request->validate([
            'exercise_id' => 'required|exists:exercises,id',
            'sets' => 'required|integer|min:1',
            'reps' => 'required|integer|min:1',
            'duration_minutes' => 'nullable|integer|min:1',
            'rest_seconds' => 'nullable|integer|min:0',
            'order' => 'nullable|integer|min:1',
        ]);

        $workoutDay->exercises()->attach($request->exercise_id, [
            'sets' => $request->sets,
            'reps' => $request->reps,
            'duration_minutes' => $request->duration_minutes,
            'rest_seconds' => $request->rest_seconds,
            'order' => $request->order,
        ]);

        return response()->json(['message' => 'Exercise attached successfully']);
    }

    public function detachExercise(Request $request, WorkoutDay $workoutDay)
    {
        $this->authorize('update', $workoutDay);

        $request->validate([
            'exercise_id' => 'required|exists:exercises,id',
        ]);

        $workoutDay->exercises()->detach($request->exercise_id);

        return response()->json(['message' => 'Exercise detached successfully']);
    }
}
