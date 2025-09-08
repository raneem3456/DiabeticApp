<?php

namespace App\Policies;

use App\Models\DoctorNote;
use App\Models\User;

class DoctorNotePolicy
{
    public function view(User $user, DoctorNote $doctorNote): bool
    {
        // Doctor can view their own notes
        if ($user->id === $doctorNote->doctor_id) {
            return true;
        }

        // Patient can view notes about them (unless private)
        if ($user->id === $doctorNote->patient_id && !$doctorNote->is_private) {
            return true;
        }

        // Other doctors can view notes (for consultation)
        if ($user->role === 'doctor') {
            return true;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->role === 'doctor';
    }

    public function update(User $user, DoctorNote $doctorNote): bool
    {
        return $user->id === $doctorNote->doctor_id;
    }

    public function delete(User $user, DoctorNote $doctorNote): bool
    {
        return $user->id === $doctorNote->doctor_id;
    }
}
