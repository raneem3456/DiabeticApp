<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\GlucoseReading;
use Illuminate\Http\Request;

class GlucoseReadingController extends Controller
{
    public function index(Request $request)
    {
        $readings = $request->user()->glucoseReadings()
            ->orderBy('measured_at', 'desc')
            ->paginate(20);

        return response()->json($readings);
    }

    public function show(Request $request, GlucoseReading $glucoseReading)
    {
        $this->authorize('view', $glucoseReading);

        return response()->json($glucoseReading);
    }

    public function store(Request $request)
    {
        $request->validate([
            'value' => 'required|numeric|min:0|max:1000',
            'unit' => 'required|in:mg/dL,mmol/L',
            'source' => 'required|in:finger_prick,cgm,other',
            'meal_context' => 'nullable|in:fasting,before_meal,after_meal,bedtime,other',
            'notes' => 'nullable|string',
            'measured_at' => 'required|date',
        ]);

        $reading = $request->user()->glucoseReadings()->create($request->all());

        return response()->json($reading, 201);
    }

    public function update(Request $request, GlucoseReading $glucoseReading)
    {
        $this->authorize('update', $glucoseReading);

        $request->validate([
            'value' => 'sometimes|required|numeric|min:0|max:1000',
            'unit' => 'sometimes|required|in:mg/dL,mmol/L',
            'source' => 'sometimes|required|in:finger_prick,cgm,other',
            'meal_context' => 'nullable|in:fasting,before_meal,after_meal,bedtime,other',
            'notes' => 'nullable|string',
            'measured_at' => 'sometimes|required|date',
        ]);

        $glucoseReading->update($request->all());

        return response()->json($glucoseReading);
    }

    public function destroy(Request $request, GlucoseReading $glucoseReading)
    {
        $this->authorize('delete', $glucoseReading);

        $glucoseReading->delete();

        return response()->json(['message' => 'Glucose reading deleted successfully']);
    }
}
