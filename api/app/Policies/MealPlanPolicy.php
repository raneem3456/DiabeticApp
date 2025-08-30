<?php

namespace App\Policies;

use App\Models\MealPlan;
use App\Models\User;

class MealPlanPolicy
{
    public function view(User $user, MealPlan $mealPlan): bool
    {
        // Patient can view their own meal plans
        if ($user->id === $mealPlan->patient_id) {
            return true;
        }

        // Nutritionist can view meal plans they created
        if ($user->id === $mealPlan->nutritionist_id) {
            return true;
        }

        // Other nutritionists can view for consultation
        if ($user->role === 'nutritionist') {
            return true;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->role === 'nutritionist';
    }

    public function update(User $user, MealPlan $mealPlan): bool
    {
        return $user->id === $mealPlan->nutritionist_id;
    }

    public function delete(User $user, MealPlan $mealPlan): bool
    {
        return $user->id === $mealPlan->nutritionist_id;
    }
}
