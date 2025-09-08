<?php

namespace App\Policies;

use App\Models\WorkoutPlan;
use App\Models\User;

class WorkoutPlanPolicy
{
    public function view(User $user, WorkoutPlan $workoutPlan): bool
    {
        // Patient can view their own workout plans
        if ($user->id === $workoutPlan->patient_id) {
            return true;
        }

        // Coach can view workout plans they created
        if ($user->id === $workoutPlan->coach_id) {
            return true;
        }

        // Other coaches can view for consultation
        if ($user->role === 'coach') {
            return true;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->role === 'coach';
    }

    public function update(User $user, WorkoutPlan $workoutPlan): bool
    {
        return $user->id === $workoutPlan->coach_id;
    }

    public function delete(User $user, WorkoutPlan $workoutPlan): bool
    {
        return $user->id === $workoutPlan->coach_id;
    }
}
