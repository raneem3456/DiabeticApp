<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $profile = $request->user()->profile;
        
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json($profile);
    }

    public function store(Request $request)
    {
        $request->validate([
            'diabetes_type' => 'nullable|in:type1,type2,gestational,prediabetes,other',
            'weight' => 'nullable|numeric|min:0|max:500',
            'height' => 'nullable|numeric|min:0|max:300',
            'target_glucose_min' => 'nullable|numeric|min:0|max:1000',
            'target_glucose_max' => 'nullable|numeric|min:0|max:1000',
            'diagnosis_date' => 'nullable|date',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'medications' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relation' => 'nullable|string|max:255',
        ]);

        $profile = $request->user()->profile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $request->all()
        );

        return response()->json($profile, 201);
    }

    public function update(Request $request)
    {
        $request->validate([
            'diabetes_type' => 'nullable|in:type1,type2,gestational,prediabetes,other',
            'weight' => 'nullable|numeric|min:0|max:500',
            'height' => 'nullable|numeric|min:0|max:300',
            'target_glucose_min' => 'nullable|numeric|min:0|max:1000',
            'target_glucose_max' => 'nullable|numeric|min:0|max:1000',
            'diagnosis_date' => 'nullable|date',
            'medical_history' => 'nullable|string',
            'allergies' => 'nullable|string',
            'medications' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relation' => 'nullable|string|max:255',
        ]);

        $profile = $request->user()->profile;
        
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $profile->update($request->all());

        return response()->json($profile);
    }
}
