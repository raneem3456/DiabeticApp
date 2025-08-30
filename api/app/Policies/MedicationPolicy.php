<?php

namespace App\Policies;

use App\Models\Medication;
use App\Models\User;

class MedicationPolicy
{
    public function view(User $user, Medication $medication): bool
    {
        return $user->id === $medication->patient_id || 
               $user->id === $medication->prescribed_by ||
               $user->role === 'admin';
    }

    public function create(User $user): bool
    {
        return $user->role === 'doctor' || $user->role === 'admin';
    }

    public function update(User $user, Medication $medication): bool
    {
        return $user->id === $medication->prescribed_by || $user->role === 'admin';
    }

    public function delete(User $user, Medication $medication): bool
    {
        return $user->id === $medication->prescribed_by || $user->role === 'admin';
    }
}
