<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\ChallengeEntry;
use Illuminate\Http\Request;

class ChallengeEntryController extends Controller
{
    public function index(Request $request)
    {
        $entries = $request->user()->challengeEntries()
            ->with('challenge')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($entries);
    }

    public function show(Request $request, ChallengeEntry $challengeEntry)
    {
        $this->authorize('view', $challengeEntry);
        return response()->json($challengeEntry->load('challenge'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'challenge_id' => 'required|exists:challenges,id',
            'progress_value' => 'required|numeric|min:0',
            'notes' => 'nullable|string|max:500',
            'completed_at' => 'nullable|date',
        ]);

        $entry = $request->user()->challengeEntries()->create([
            'challenge_id' => $request->challenge_id,
            'progress_value' => $request->progress_value,
            'notes' => $request->notes,
            'completed_at' => $request->completed_at,
        ]);

        return response()->json($entry->load('challenge'), 201);
    }

    public function update(Request $request, ChallengeEntry $challengeEntry)
    {
        $this->authorize('update', $challengeEntry);

        $request->validate([
            'progress_value' => 'sometimes|required|numeric|min:0',
            'notes' => 'nullable|string|max:500',
            'completed_at' => 'nullable|date',
        ]);

        $challengeEntry->update($request->only(['progress_value', 'notes', 'completed_at']));

        return response()->json($challengeEntry->load('challenge'));
    }

    public function destroy(Request $request, ChallengeEntry $challengeEntry)
    {
        $this->authorize('delete', $challengeEntry);
        $challengeEntry->delete();

        return response()->json(['message' => 'Challenge entry deleted successfully']);
    }
}
