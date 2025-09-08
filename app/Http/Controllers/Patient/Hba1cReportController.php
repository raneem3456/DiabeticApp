<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Hba1cReport;
use Illuminate\Http\Request;

class Hba1cReportController extends Controller
{
    public function index(Request $request)
    {
        $reports = $request->user()->hba1cReports()
            ->orderBy('test_date', 'desc')
            ->paginate(15);

        return response()->json($reports);
    }

    public function show(Request $request, Hba1cReport $hba1cReport)
    {
        $this->authorize('view', $hba1cReport);
        return response()->json($hba1cReport);
    }

    public function store(Request $request)
    {
        $request->validate([
            'hba1c_value' => 'required|numeric|between:3.0,20.0',
            'test_date' => 'required|date',
            'lab_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'target_range_min' => 'nullable|numeric|min:0',
            'target_range_max' => 'nullable|numeric|min:0',
        ]);

        $report = $request->user()->hba1cReports()->create([
            'hba1c_value' => $request->hba1c_value,
            'test_date' => $request->test_date,
            'lab_name' => $request->lab_name,
            'notes' => $request->notes,
            'target_range_min' => $request->target_range_min,
            'target_range_max' => $request->target_range_max,
        ]);

        return response()->json($report, 201);
    }

    public function update(Request $request, Hba1cReport $hba1cReport)
    {
        $this->authorize('update', $hba1cReport);

        $request->validate([
            'hba1c_value' => 'sometimes|required|numeric|between:3.0,20.0',
            'test_date' => 'sometimes|required|date',
            'lab_name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'target_range_min' => 'nullable|numeric|min:0',
            'target_range_max' => 'nullable|numeric|min:0',
        ]);

        $hba1cReport->update($request->only([
            'hba1c_value', 'test_date', 'lab_name', 'notes', 
            'target_range_min', 'target_range_max'
        ]));

        return response()->json($hba1cReport);
    }

    public function destroy(Request $request, Hba1cReport $hba1cReport)
    {
        $this->authorize('delete', $hba1cReport);
        $hba1cReport->delete();

        return response()->json(['message' => 'HbA1c report deleted successfully']);
    }
}
