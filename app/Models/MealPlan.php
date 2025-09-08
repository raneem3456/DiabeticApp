<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MealPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'nutritionist_id',
        'title',
        'description',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function nutritionist()
    {
        return $this->belongsTo(User::class, 'nutritionist_id');
    }

    public function mealPlanDays()
    {
        return $this->hasMany(MealPlanDay::class);
    }
}
