<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Medication;
use App\Models\User;
use Illuminate\Http\Request;

class MedicationController extends Controller
{
    public function index(Request $request)
    {
        $medications = Medication::with(['patient', 'prescribedBy'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($medications);
    }

    public function show(Request $request, Medication $medication)
    {
        $this->authorize('view', $medication);
        return response()->json($medication->load(['patient', 'prescribedBy']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'dosage' => 'required|string|max:100',
            'frequency' => 'required|string|max:100',
            'route' => 'required|in:oral,injection,inhalation,topical,other',
            'instructions' => 'nullable|string|max:1000',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'boolean',
            'side_effects' => 'nullable|string|max:1000',
            'contraindications' => 'nullable|string|max:1000',
            'pharmacy' => 'nullable|string|max:255',
            'prescription_number' => 'nullable|string|max:100',
        ]);

        $medication = Medication::create([
            'patient_id' => $request->patient_id,
            'prescribed_by' => $request->user()->id,
            'name' => $request->name,
            'dosage' => $request->dosage,
            'frequency' => $request->frequency,
            'route' => $request->route,
            'instructions' => $request->instructions,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_active' => $request->is_active ?? true,
            'side_effects' => $request->side_effects,
            'contraindications' => $request->contraindications,
            'pharmacy' => $request->pharmacy,
            'prescription_number' => $request->prescription_number,
        ]);

        return response()->json($medication->load(['patient', 'prescribedBy']), 201);
    }

    public function update(Request $request, Medication $medication)
    {
        $this->authorize('update', $medication);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'dosage' => 'sometimes|required|string|max:100',
            'frequency' => 'sometimes|required|string|max:100',
            'route' => 'sometimes|required|in:oral,injection,inhalation,topical,other',
            'instructions' => 'nullable|string|max:1000',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'boolean',
            'side_effects' => 'nullable|string|max:1000',
            'contraindications' => 'nullable|string|max:1000',
            'pharmacy' => 'nullable|string|max:255',
            'prescription_number' => 'nullable|string|max:100',
        ]);

        $medication->update($request->only([
            'name', 'dosage', 'frequency', 'route', 'instructions', 'start_date',
            'end_date', 'is_active', 'side_effects', 'contraindications',
            'pharmacy', 'prescription_number'
        ]));

        return response()->json($medication->load(['patient', 'prescribedBy']));
    }

    public function destroy(Request $request, Medication $medication)
    {
        $this->authorize('delete', $medication);
        $medication->delete();

        return response()->json(['message' => 'Medication deleted successfully']);
    }

    public function patientMedications(Request $request, $patientId)
    {
        $medications = Medication::where('patient_id', $patientId)
            ->with(['prescribedBy'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($medications);
    }

    public function activeMedications(Request $request, $patientId)
    {
        $medications = Medication::where('patient_id', $patientId)
            ->where('is_active', true)
            ->where(function($query) {
                $query->whereNull('end_date')
                      ->orWhere('end_date', '>=', now());
            })
            ->with(['prescribedBy'])
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json($medications);
    }
}
