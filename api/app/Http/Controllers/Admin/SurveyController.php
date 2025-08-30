<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    public function index(Request $request)
    {
        $surveys = Survey::with('questions')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($surveys);
    }

    public function show(Request $request, Survey $survey)
    {
        return response()->json($survey->load('questions'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'published' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'target_role' => 'required|in:all,patient,doctor,nutritionist,coach,family',
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
            'target_role' => 'sometimes|required|in:all,patient,doctor,nutritionist,coach,family',
        ]);

        $survey->update($request->all());

        return response()->json($survey);
    }

    public function destroy(Request $request, Survey $survey)
    {
        $survey->delete();

        return response()->json(['message' => 'Survey deleted successfully']);
    }
}
