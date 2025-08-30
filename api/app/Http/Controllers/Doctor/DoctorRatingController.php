<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\DoctorRating;
use Illuminate\Http\Request;

class DoctorRatingController extends Controller
{
    public function index(Request $request)
    {
        $ratings = $request->user()->doctorRatings()
            ->with('patient')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($ratings);
    }

    public function show(Request $request, DoctorRating $doctorRating)
    {
        $this->authorize('view', $doctorRating);
        return response()->json($doctorRating->load('patient'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $rating = $request->user()->doctorRatings()->create([
            'doctor_id' => $request->doctor_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json($rating->load('doctor'), 201);
    }

    public function update(Request $request, DoctorRating $doctorRating)
    {
        $this->authorize('update', $doctorRating);

        $request->validate([
            'rating' => 'sometimes|required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $doctorRating->update($request->only(['rating', 'comment']));

        return response()->json($doctorRating->load('doctor'));
    }

    public function destroy(Request $request, DoctorRating $doctorRating)
    {
        $this->authorize('delete', $doctorRating);
        $doctorRating->delete();

        return response()->json(['message' => 'Doctor rating deleted successfully']);
    }
}
