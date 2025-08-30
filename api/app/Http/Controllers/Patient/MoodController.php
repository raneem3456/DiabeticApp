<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Mood;
use Illuminate\Http\Request;

class MoodController extends Controller
{
    public function index(Request $request)
    {
        $moods = $request->user()->moods()
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($moods);
    }

    public function show(Request $request, Mood $mood)
    {
        $this->authorize('view', $mood);
        return response()->json($mood);
    }

    public function store(Request $request)
    {
        $request->validate([
            'mood_level' => 'required|integer|between:1,10',
            'notes' => 'nullable|string|max:500',
            'recorded_at' => 'nullable|date',
        ]);

        $mood = $request->user()->moods()->create([
            'mood_level' => $request->mood_level,
            'notes' => $request->notes,
            'recorded_at' => $request->recorded_at ?? now(),
        ]);

        return response()->json($mood, 201);
    }

    public function update(Request $request, Mood $mood)
    {
        $this->authorize('update', $mood);

        $request->validate([
            'mood_level' => 'sometimes|required|integer|between:1,10',
            'notes' => 'nullable|string|max:500',
            'recorded_at' => 'nullable|date',
        ]);

        $mood->update($request->only(['mood_level', 'notes', 'recorded_at']));

        return response()->json($mood);
    }

    public function destroy(Request $request, Mood $mood)
    {
        $this->authorize('delete', $mood);
        $mood->delete();

        return response()->json(['message' => 'Mood record deleted successfully']);
    }
}
