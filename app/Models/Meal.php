<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'kcal',
        'carbs',
        'protein',
        'fat',
        'fiber',
        'sugar',
        'meal_type',
        'is_vegetarian',
        'is_vegan',
        'is_gluten_free',
        'image_url',
    ];

    protected $casts = [
        'carbs' => 'decimal:2',
        'protein' => 'decimal:2',
        'fat' => 'decimal:2',
        'fiber' => 'decimal:2',
        'sugar' => 'decimal:2',
        'is_vegetarian' => 'boolean',
        'is_vegan' => 'boolean',
        'is_gluten_free' => 'boolean',
    ];

    public function mealItems()
    {
        return $this->hasMany(MealItem::class);
    }

    public function nutritionLogs()
    {
        return $this->hasMany(NutritionLog::class);
    }

    public function mealPlanDays()
    {
        return $this->hasMany(MealPlanDay::class, 'breakfast_meal_id')
            ->orWhere('lunch_meal_id', $this->id)
            ->orWhere('dinner_meal_id', $this->id)
            ->orWhere('snack_meal_id', $this->id);
    }
}
