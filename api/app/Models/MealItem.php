<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MealItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'meal_id',
        'name',
        'grams',
        'carbs',
        'protein',
        'fat',
        'kcal',
    ];

    protected $casts = [
        'grams' => 'decimal:2',
        'carbs' => 'decimal:2',
        'protein' => 'decimal:2',
        'fat' => 'decimal:2',
    ];

    public function meal()
    {
        return $this->belongsTo(Meal::class);
    }
}
