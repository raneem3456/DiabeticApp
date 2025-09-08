<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\DoctorNote;
use App\Models\User;
use Illuminate\Http\Request;

class DoctorNoteController extends Controller
{
    public function index(Request $request)
    {
        $notes = $request->user()->patientsAsDoctor()
            ->with(['patient', 'doctor'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($notes);
    }

    public function show(Request $request, DoctorNote $doctorNote)
    {
        $this->authorize('view', $doctorNote);

        return response()->json($doctorNote->load(['patient', 'doctor']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:users,id',
            'note' => 'required|string',
            'type' => 'required|in:consultation,follow_up,emergency,routine',
            'is_private' => 'boolean',
        ]);

        $note = $request->user()->patientsAsDoctor()->create($request->all());

        return response()->json($note->load(['patient', 'doctor']), 201);
    }

    public function update(Request $request, DoctorNote $doctorNote)
    {
        $this->authorize('update', $doctorNote);

        $request->validate([
            'note' => 'sometimes|required|string',
            'type' => 'sometimes|required|in:consultation,follow_up,emergency,routine',
            'is_private' => 'boolean',
        ]);

        $doctorNote->update($request->all());

        return response()->json($doctorNote->load(['patient', 'doctor']));
    }

    public function destroy(Request $request, DoctorNote $doctorNote)
    {
        $this->authorize('delete', $doctorNote);

        $doctorNote->delete();

        return response()->json(['message' => 'Doctor note deleted successfully']);
    }

    public function patientNotes(Request $request, User $patient)
    {
        $notes = $request->user()->patientsAsDoctor()
            ->where('patient_id', $patient->id)
            ->with(['patient', 'doctor'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($notes);
    }
}
