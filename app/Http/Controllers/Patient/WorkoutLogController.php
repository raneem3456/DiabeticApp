<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\WorkoutLog;
use Illuminate\Http\Request;

class WorkoutLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = $request->user()->workoutLogs()
            ->with('exercise')
            ->orderBy('logged_at', 'desc')
            ->paginate(20);

        return response()->json($logs);
    }

    public function show(Request $request, WorkoutLog $workoutLog)
    {
        $this->authorize('view', $workoutLog);

        return response()->json($workoutLog->load('exercise'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'exercise_id' => 'nullable|exists:exercises,id',
            'exercise_name' => 'nullable|string|max:255',
            'sets' => 'nullable|integer|min:0',
            'reps' => 'nullable|integer|min:0',
            'duration_minutes' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
            'logged_at' => 'required|date',
        ]);

        $log = $request->user()->workoutLogs()->create($request->all());

        return response()->json($log->load('exercise'), 201);
    }

    public function update(Request $request, WorkoutLog $workoutLog)
    {
        $this->authorize('update', $workoutLog);

        $request->validate([
            'exercise_id' => 'nullable|exists:exercises,id',
            'exercise_name' => 'nullable|string|max:255',
            'sets' => 'nullable|integer|min:0',
            'reps' => 'nullable|integer|min:0',
            'duration_minutes' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
            'logged_at' => 'sometimes|required|date',
        ]);

        $workoutLog->update($request->all());

        return response()->json($workoutLog->load('exercise'));
    }

    public function destroy(Request $request, WorkoutLog $workoutLog)
    {
        $this->authorize('delete', $workoutLog);

        $workoutLog->delete();

        return response()->json(['message' => 'Workout log deleted successfully']);
    }
}
