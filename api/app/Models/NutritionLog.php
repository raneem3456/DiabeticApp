<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NutritionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'meal_id',
        'meal_name',
        'carbs',
        'protein',
        'fat',
        'kcal',
        'meal_type',
        'notes',
        'logged_at',
    ];

    protected $casts = [
        'carbs' => 'decimal:2',
        'protein' => 'decimal:2',
        'fat' => 'decimal:2',
        'logged_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function meal()
    {
        return $this->belongsTo(Meal::class);
    }
}
