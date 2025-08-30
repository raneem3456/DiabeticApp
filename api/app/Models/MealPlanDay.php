<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MealPlanDay extends Model
{
    use HasFactory;

    protected $fillable = [
        'meal_plan_id',
        'day',
        'breakfast_meal_id',
        'lunch_meal_id',
        'dinner_meal_id',
        'snack_meal_id',
        'notes',
    ];

    public function mealPlan()
    {
        return $this->belongsTo(MealPlan::class);
    }

    public function breakfastMeal()
    {
        return $this->belongsTo(Meal::class, 'breakfast_meal_id');
    }

    public function lunchMeal()
    {
        return $this->belongsTo(Meal::class, 'lunch_meal_id');
    }

    public function dinnerMeal()
    {
        return $this->belongsTo(Meal::class, 'dinner_meal_id');
    }

    public function snackMeal()
    {
        return $this->belongsTo(Meal::class, 'snack_meal_id');
    }
}
