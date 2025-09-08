<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SurveyAnswer;
use Illuminate\Http\Request;

class SurveyAnswerController extends Controller
{
    public function index(Request $request)
    {
        $answers = SurveyAnswer::with(['survey', 'question', 'user'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($answers);
    }

    public function show(Request $request, SurveyAnswer $surveyAnswer)
    {
        $this->authorize('view', $surveyAnswer);
        return response()->json($surveyAnswer->load(['survey', 'question', 'user']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'survey_id' => 'required|exists:surveys,id',
            'question_id' => 'required|exists:survey_questions,id',
            'user_id' => 'required|exists:users,id',
            'answer_text' => 'nullable|string|max:1000',
            'answer_value' => 'nullable|numeric',
            'answer_options' => 'nullable|array',
        ]);

        $answer = SurveyAnswer::create([
            'survey_id' => $request->survey_id,
            'question_id' => $request->question_id,
            'user_id' => $request->user_id,
            'answer_text' => $request->answer_text,
            'answer_value' => $request->answer_value,
            'answer_options' => $request->answer_options,
        ]);

        return response()->json($answer->load(['survey', 'question', 'user']), 201);
    }

    public function update(Request $request, SurveyAnswer $surveyAnswer)
    {
        $this->authorize('update', $surveyAnswer);

        $request->validate([
            'answer_text' => 'nullable|string|max:1000',
            'answer_value' => 'nullable|numeric',
            'answer_options' => 'nullable|array',
        ]);

        $surveyAnswer->update($request->only([
            'answer_text', 'answer_value', 'answer_options'
        ]));

        return response()->json($surveyAnswer->load(['survey', 'question', 'user']));
    }

    public function destroy(Request $request, SurveyAnswer $surveyAnswer)
    {
        $this->authorize('delete', $surveyAnswer);
        $surveyAnswer->delete();

        return response()->json(['message' => 'Survey answer deleted successfully']);
    }
}
