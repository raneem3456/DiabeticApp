<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use Illuminate\Http\Request;

class ChallengeController extends Controller
{
    public function index(Request $request)
    {
        $challenges = Challenge::with('entries')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($challenges);
    }

    public function show(Request $request, Challenge $challenge)
    {
        return response()->json($challenge->load('entries'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|url',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'type' => 'required|in:glucose_tracking,exercise,nutrition,medication,general',
            'target_value' => 'nullable|integer|min:0',
            'target_unit' => 'nullable|string|max:50',
            'points_reward' => 'integer|min:0',
            'active' => 'boolean',
        ]);

        $challenge = Challenge::create($request->all());

        return response()->json($challenge, 201);
    }

    public function update(Request $request, Challenge $challenge)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'image_url' => 'nullable|url',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after:start_date',
            'type' => 'sometimes|required|in:glucose_tracking,exercise,nutrition,medication,general',
            'target_value' => 'nullable|integer|min:0',
            'target_unit' => 'nullable|string|max:50',
            'points_reward' => 'integer|min:0',
            'active' => 'boolean',
        ]);

        $challenge->update($request->all());

        return response()->json($challenge);
    }

    public function destroy(Request $request, Challenge $challenge)
    {
        $challenge->delete();

        return response()->json(['message' => 'Challenge deleted successfully']);
    }
}
