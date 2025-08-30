<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SurveyQuestion;
use Illuminate\Http\Request;

class SurveyQuestionController extends Controller
{
    public function index(Request $request)
    {
        $questions = SurveyQuestion::with('survey')
            ->orderBy('order', 'asc')
            ->paginate(15);

        return response()->json($questions);
    }

    public function show(Request $request, SurveyQuestion $surveyQuestion)
    {
        $this->authorize('view', $surveyQuestion);
        return response()->json($surveyQuestion->load('survey'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'survey_id' => 'required|exists:surveys,id',
            'question_text' => 'required|string|max:1000',
            'question_type' => 'required|in:multiple_choice,text,rating,boolean',
            'options' => 'nullable|array',
            'required' => 'boolean',
            'order' => 'nullable|integer|min:1',
        ]);

        $question = SurveyQuestion::create([
            'survey_id' => $request->survey_id,
            'question_text' => $request->question_text,
            'question_type' => $request->question_type,
            'options' => $request->options,
            'required' => $request->required ?? false,
            'order' => $request->order,
        ]);

        return response()->json($question->load('survey'), 201);
    }

    public function update(Request $request, SurveyQuestion $surveyQuestion)
    {
        $this->authorize('update', $surveyQuestion);

        $request->validate([
            'question_text' => 'sometimes|required|string|max:1000',
            'question_type' => 'sometimes|required|in:multiple_choice,text,rating,boolean',
            'options' => 'nullable|array',
            'required' => 'boolean',
            'order' => 'nullable|integer|min:1',
        ]);

        $surveyQuestion->update($request->only([
            'question_text', 'question_type', 'options', 'required', 'order'
        ]));

        return response()->json($surveyQuestion->load('survey'));
    }

    public function destroy(Request $request, SurveyQuestion $surveyQuestion)
    {
        $this->authorize('delete', $surveyQuestion);
        $surveyQuestion->delete();

        return response()->json(['message' => 'Survey question deleted successfully']);
    }
}
