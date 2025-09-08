<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\ChallengeEntry;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ChallengeController extends Controller
{
    public function index(Request $request)
    {
        $query = Challenge::with(['entries', 'entries.user']);

        // Advanced filtering
        if ($request->has('status')) {
            $query->where('active', $request->boolean('status'));
        }

        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('date_from')) {
            $query->where('start_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('end_date', '<=', $request->date_to);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $challenges = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 20));

        return response()->json($challenges);
    }

    public function show(Request $request, Challenge $challenge)
    {
        $challenge->load(['entries.user', 'entries.user.profile']);
        
        // Add challenge statistics
        $challenge->participant_count = $challenge->entries()->distinct('user_id')->count();
        $challenge->completion_rate = $this->calculateCompletionRate($challenge);
        $challenge->average_progress = $this->calculateAverageProgress($challenge);
        
        return response()->json($challenge);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|url',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'type' => ['required', Rule::in(['glucose_tracking', 'exercise', 'nutrition', 'medication', 'general'])],
            'target_value' => 'nullable|integer|min:0',
            'target_unit' => 'nullable|string|max:50',
            'points_reward' => 'integer|min:0',
            'active' => 'boolean',
            'max_participants' => 'nullable|integer|min:1',
            'min_age' => 'nullable|integer|min:0',
            'max_age' => 'nullable|integer|min:0',
            'gender_restriction' => 'nullable|in:male,female,all',
            'diabetes_type_restriction' => 'nullable|array',
            'diabetes_type_restriction.*' => 'in:type1,type2,gestational,prediabetes',
            'difficulty_level' => 'nullable|in:easy,medium,hard,expert',
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => 'string|max:255',
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
            'type' => ['sometimes', 'required', Rule::in(['glucose_tracking', 'exercise', 'nutrition', 'medication', 'general'])],
            'target_value' => 'nullable|integer|min:0',
            'target_unit' => 'nullable|string|max:50',
            'points_reward' => 'integer|min:0',
            'active' => 'boolean',
            'max_participants' => 'nullable|integer|min:1',
            'min_age' => 'nullable|integer|min:0',
            'max_age' => 'nullable|integer|min:0',
            'gender_restriction' => 'nullable|in:male,female,all',
            'diabetes_type_restriction' => 'nullable|array',
            'diabetes_type_restriction.*' => 'in:type1,type2,gestational,prediabetes',
            'difficulty_level' => 'nullable|in:easy,medium,hard,expert',
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => 'string|max:255',
        ]);

        $challenge->update($request->all());

        return response()->json($challenge);
    }

    public function destroy(Request $request, Challenge $challenge)
    {
        $challenge->delete();

        return response()->json(['message' => 'Challenge deleted successfully']);
    }

    // New enhanced methods

    public function bulkActivate(Request $request)
    {
        $request->validate([
            'challenge_ids' => 'required|array',
            'challenge_ids.*' => 'exists:challenges,id'
        ]);

        Challenge::whereIn('id', $request->challenge_ids)->update(['active' => true]);

        return response()->json(['message' => 'Challenges activated successfully']);
    }

    public function bulkDeactivate(Request $request)
    {
        $request->validate([
            'challenge_ids' => 'required|array',
            'challenge_ids.*' => 'exists:challenges,id'
        ]);

        Challenge::whereIn('id', $request->challenge_ids)->update(['active' => false]);

        return response()->json(['message' => 'Challenges deactivated successfully']);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'challenge_ids' => 'required|array',
            'challenge_ids.*' => 'exists:challenges,id'
        ]);

        Challenge::whereIn('id', $request->challenge_ids)->delete();

        return response()->json(['message' => 'Challenges deleted successfully']);
    }

    public function analytics(Request $request, Challenge $challenge)
    {
        $analytics = [
            'total_participants' => $challenge->entries()->distinct('user_id')->count(),
            'completion_rate' => $this->calculateCompletionRate($challenge),
            'average_progress' => $this->calculateAverageProgress($challenge),
            'participation_trend' => $this->getParticipationTrend($challenge),
            'role_distribution' => $this->getRoleDistribution($challenge),
            'age_distribution' => $this->getAgeDistribution($challenge),
            'gender_distribution' => $this->getGenderDistribution($challenge),
            'top_performers' => $this->getTopPerformers($challenge),
            'progress_distribution' => $this->getProgressDistribution($challenge),
        ];

        return response()->json($analytics);
    }

    public function participants(Request $request, Challenge $challenge)
    {
        $participants = $challenge->entries()
            ->with(['user', 'user.profile'])
            ->select('user_id', DB::raw('MAX(progress) as current_progress'), DB::raw('COUNT(*) as entries_count'))
            ->groupBy('user_id')
            ->orderBy('current_progress', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($participants);
    }

    public function addParticipant(Request $request, Challenge $challenge)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'initial_progress' => 'nullable|integer|min:0',
            'notes' => 'nullable|string|max:500',
        ]);

        // Check if user is already participating
        if ($challenge->entries()->where('user_id', $request->user_id)->exists()) {
            return response()->json(['message' => 'User is already participating in this challenge'], 400);
        }

        $entry = ChallengeEntry::create([
            'challenge_id' => $challenge->id,
            'user_id' => $request->user_id,
            'progress' => $request->initial_progress ?? 0,
            'notes' => $request->notes,
        ]);

        return response()->json($entry->load('user'), 201);
    }

    public function removeParticipant(Request $request, Challenge $challenge, $userId)
    {
        $challenge->entries()->where('user_id', $userId)->delete();

        return response()->json(['message' => 'Participant removed successfully']);
    }

    public function updateParticipantProgress(Request $request, Challenge $challenge, $userId)
    {
        $request->validate([
            'progress' => 'required|integer|min:0',
            'notes' => 'nullable|string|max:500',
        ]);

        $entry = $challenge->entries()
            ->where('user_id', $userId)
            ->latest()
            ->first();

        if (!$entry) {
            return response()->json(['message' => 'User is not participating in this challenge'], 404);
        }

        $entry->update([
            'progress' => $request->progress,
            'notes' => $request->notes,
        ]);

        return response()->json($entry->load('user'));
    }

    public function exportParticipants(Request $request, Challenge $challenge)
    {
        $participants = $challenge->entries()
            ->with(['user', 'user.profile'])
            ->get()
            ->groupBy('user_id');

        $exportData = [];
        foreach ($participants as $userId => $entries) {
            $user = $entries->first()->user;
            $latestEntry = $entries->sortByDesc('created_at')->first();
            
            $exportData[] = [
                'user_id' => $userId,
                'user_name' => $user->name,
                'user_email' => $user->email,
                'current_progress' => $latestEntry->progress,
                'total_entries' => $entries->count(),
                'joined_at' => $entries->sortBy('created_at')->first()->created_at,
                'last_updated' => $latestEntry->updated_at,
                'completion_percentage' => $challenge->target_value ? 
                    round(($latestEntry->progress / $challenge->target_value) * 100, 2) : 0
            ];
        }

        return response()->json($exportData);
    }

    public function duplicate(Request $request, Challenge $challenge)
    {
        $newChallenge = $challenge->replicate();
        $newChallenge->title = $challenge->title . ' (Copy)';
        $newChallenge->active = false;
        $newChallenge->start_date = now()->addDays(7);
        $newChallenge->end_date = now()->addDays(37);
        $newChallenge->save();

        return response()->json($newChallenge, 201);
    }

    private function calculateCompletionRate(Challenge $challenge)
    {
        if (!$challenge->target_value) return 0;

        $completedParticipants = $challenge->entries()
            ->select('user_id', DB::raw('MAX(progress) as max_progress'))
            ->groupBy('user_id')
            ->having('max_progress', '>=', $challenge->target_value)
            ->count();

        $totalParticipants = $challenge->entries()->distinct('user_id')->count();
        
        return $totalParticipants > 0 ? round(($completedParticipants / $totalParticipants) * 100, 2) : 0;
    }

    private function calculateAverageProgress(Challenge $challenge)
    {
        $avgProgress = $challenge->entries()
            ->select('user_id', DB::raw('MAX(progress) as max_progress'))
            ->groupBy('user_id')
            ->avg('max_progress');

        return round($avgProgress ?? 0, 2);
    }

    private function getParticipationTrend(Challenge $challenge)
    {
        return $challenge->entries()
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(DISTINCT user_id) as new_participants'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    private function getRoleDistribution(Challenge $challenge)
    {
        return $challenge->entries()
            ->join('users', 'challenge_entries.user_id', '=', 'users.id')
            ->select('users.role', DB::raw('COUNT(DISTINCT challenge_entries.user_id) as count'))
            ->groupBy('users.role')
            ->get();
    }

    private function getAgeDistribution(Challenge $challenge)
    {
        return $challenge->entries()
            ->join('users', 'challenge_entries.user_id', '=', 'users.id')
            ->select(DB::raw('CASE 
                WHEN users.age < 18 THEN "Under 18"
                WHEN users.age BETWEEN 18 AND 30 THEN "18-30"
                WHEN users.age BETWEEN 31 AND 50 THEN "31-50"
                WHEN users.age BETWEEN 51 AND 65 THEN "51-65"
                ELSE "Over 65"
            END as age_group'), DB::raw('COUNT(DISTINCT challenge_entries.user_id) as count'))
            ->groupBy('age_group')
            ->get();
    }

    private function getGenderDistribution(Challenge $challenge)
    {
        return $challenge->entries()
            ->join('users', 'challenge_entries.user_id', '=', 'users.id')
            ->select('users.gender', DB::raw('COUNT(DISTINCT challenge_entries.user_id) as count'))
            ->groupBy('users.gender')
            ->get();
    }

    private function getTopPerformers(Challenge $challenge, $limit = 10)
    {
        return $challenge->entries()
            ->with('user')
            ->select('user_id', DB::raw('MAX(progress) as max_progress'))
            ->groupBy('user_id')
            ->orderBy('max_progress', 'desc')
            ->limit($limit)
            ->get();
    }

    private function getProgressDistribution(Challenge $challenge)
    {
        if (!$challenge->target_value) return [];

        return $challenge->entries()
            ->select('user_id', DB::raw('MAX(progress) as max_progress'))
            ->groupBy('user_id')
            ->selectRaw('CASE 
                WHEN MAX(progress) = 0 THEN "Not Started"
                WHEN MAX(progress) < ? * 0.25 THEN "0-25%"
                WHEN MAX(progress) < ? * 0.5 THEN "25-50%"
                WHEN MAX(progress) < ? * 0.75 THEN "50-75%"
                WHEN MAX(progress) < ? THEN "75-99%"
                ELSE "Completed"
            END as progress_range', [
                $challenge->target_value, $challenge->target_value, 
                $challenge->target_value, $challenge->target_value
            ])
            ->groupBy('progress_range')
            ->selectRaw('COUNT(*) as count')
            ->get();
    }
}
