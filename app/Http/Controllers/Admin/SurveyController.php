<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SurveyController extends Controller
{
    public function index(Request $request)
    {
        $query = Survey::with(['questions', 'answers']);

        // Advanced filtering
        if ($request->has('status')) {
            $query->where('published', $request->boolean('status'));
        }

        if ($request->has('target_role') && $request->target_role !== 'all') {
            $query->where('target_role', $request->target_role);
        }

        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $surveys = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 20));

        return response()->json($surveys);
    }

    public function show(Request $request, Survey $survey)
    {
        $survey->load(['questions.answers', 'answers.user']);
        
        // Add response statistics
        $survey->response_count = $survey->answers()->distinct('user_id')->count();
        $survey->completion_rate = $this->calculateCompletionRate($survey);
        
        return response()->json($survey);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'published' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'target_role' => ['required', Rule::in(['all', 'patient', 'doctor', 'nutritionist', 'coach', 'family'])],
            'is_anonymous' => 'boolean',
            'allow_multiple_responses' => 'boolean',
            'estimated_completion_time' => 'nullable|integer|min:1',
            'category' => 'nullable|string|max:100',
        ]);

        $survey = Survey::create($request->all());

        return response()->json($survey, 201);
    }

    public function update(Request $request, Survey $survey)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'published' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'target_role' => ['sometimes', 'required', Rule::in(['all', 'patient', 'doctor', 'nutritionist', 'coach', 'family'])],
            'is_anonymous' => 'boolean',
            'allow_multiple_responses' => 'boolean',
            'estimated_completion_time' => 'nullable|integer|min:1',
            'category' => 'nullable|string|max:100',
        ]);

        $survey->update($request->all());

        return response()->json($survey);
    }

    public function destroy(Request $request, Survey $survey)
    {
        $survey->delete();

        return response()->json(['message' => 'Survey deleted successfully']);
    }

    // New enhanced methods

    public function bulkPublish(Request $request)
    {
        $request->validate([
            'survey_ids' => 'required|array',
            'survey_ids.*' => 'exists:surveys,id'
        ]);

        Survey::whereIn('id', $request->survey_ids)->update(['published' => true]);

        return response()->json(['message' => 'Surveys published successfully']);
    }

    public function bulkUnpublish(Request $request)
    {
        $request->validate([
            'survey_ids' => 'required|array',
            'survey_ids.*' => 'exists:surveys,id'
        ]);

        Survey::whereIn('id', $request->survey_ids)->update(['published' => false]);

        return response()->json(['message' => 'Surveys unpublished successfully']);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'survey_ids' => 'required|array',
            'survey_ids.*' => 'exists:surveys,id'
        ]);

        Survey::whereIn('id', $request->survey_ids)->delete();

        return response()->json(['message' => 'Surveys deleted successfully']);
    }

    public function analytics(Request $request, Survey $survey)
    {
        $analytics = [
            'total_responses' => $survey->answers()->distinct('user_id')->count(),
            'completion_rate' => $this->calculateCompletionRate($survey),
            'average_completion_time' => $this->calculateAverageCompletionTime($survey),
            'response_trend' => $this->getResponseTrend($survey),
            'role_distribution' => $this->getRoleDistribution($survey),
            'question_analytics' => $this->getQuestionAnalytics($survey),
        ];

        return response()->json($analytics);
    }

    public function exportResponses(Request $request, Survey $survey)
    {
        $responses = $survey->answers()
            ->with(['user', 'question'])
            ->get()
            ->groupBy('user_id');

        $exportData = [];
        foreach ($responses as $userId => $userResponses) {
            $user = $userResponses->first()->user;
            $exportData[] = [
                'user_id' => $userId,
                'user_name' => $user->name,
                'user_email' => $user->email,
                'responses' => $userResponses->map(function($response) {
                    return [
                        'question' => $response->question->text,
                        'answer' => $response->answer,
                        'answered_at' => $response->created_at
                    ];
                })
            ];
        }

        return response()->json($exportData);
    }

    public function duplicate(Request $request, Survey $survey)
    {
        $newSurvey = $survey->replicate();
        $newSurvey->title = $survey->title . ' (Copy)';
        $newSurvey->published = false;
        $newSurvey->save();

        // Duplicate questions
        foreach ($survey->questions as $question) {
            $newQuestion = $question->replicate();
            $newQuestion->survey_id = $newSurvey->id;
            $newQuestion->save();
        }

        return response()->json($newSurvey->load('questions'), 201);
    }

    private function calculateCompletionRate(Survey $survey)
    {
        $totalQuestions = $survey->questions()->count();
        if ($totalQuestions === 0) return 0;

        $completedResponses = $survey->answers()
            ->select('user_id', DB::raw('COUNT(DISTINCT question_id) as answered_questions'))
            ->groupBy('user_id')
            ->having('answered_questions', '>=', $totalQuestions)
            ->count();

        $totalParticipants = $survey->answers()->distinct('user_id')->count();
        
        return $totalParticipants > 0 ? round(($completedResponses / $totalParticipants) * 100, 2) : 0;
    }

    private function calculateAverageCompletionTime(Survey $survey)
    {
        // This would need to be implemented based on your tracking mechanism
        // For now, returning a placeholder
        return null;
    }

    private function getResponseTrend(Survey $survey)
    {
        return $survey->answers()
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    private function getRoleDistribution(Survey $survey)
    {
        return $survey->answers()
            ->join('users', 'survey_answers.user_id', '=', 'users.id')
            ->select('users.role', DB::raw('COUNT(DISTINCT survey_answers.user_id) as count'))
            ->groupBy('users.role')
            ->get();
    }

    private function getQuestionAnalytics(Survey $survey)
    {
        return $survey->questions()->with('answers')->get()->map(function($question) {
            return [
                'question_id' => $question->id,
                'question_text' => $question->text,
                'response_count' => $question->answers()->count(),
                'answer_distribution' => $question->answers()
                    ->select('answer', DB::raw('COUNT(*) as count'))
                    ->groupBy('answer')
                    ->get()
            ];
        });
    }
}
