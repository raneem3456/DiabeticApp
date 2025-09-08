<?php

namespace App\Policies;

use App\Models\GlucoseReading;
use App\Models\User;

class GlucoseReadingPolicy
{
    public function view(User $user, GlucoseReading $glucoseReading): bool
    {
        // Patient can view their own readings
        if ($user->id === $glucoseReading->patient_id) {
            return true;
        }

        // Doctor can view patient readings
        if ($user->role === 'doctor') {
            return true;
        }

        // Family members can view if they have permission
        if ($user->role === 'family') {
            $familyLink = $glucoseReading->patient->familyLinks()
                ->where('family_user_id', $user->id)
                ->where('can_view_medical_data', true)
                ->first();
            
            return $familyLink !== null;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->role === 'patient';
    }

    public function update(User $user, GlucoseReading $glucoseReading): bool
    {
        return $user->id === $glucoseReading->patient_id;
    }

    public function delete(User $user, GlucoseReading $glucoseReading): bool
    {
        return $user->id === $glucoseReading->patient_id;
    }
}
