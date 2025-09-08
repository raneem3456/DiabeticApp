<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutDay extends Model
{
    use HasFactory;

    protected $fillable = [
        'workout_plan_id',
        'day',
        'notes',
    ];

    public function workoutPlan()
    {
        return $this->belongsTo(WorkoutPlan::class);
    }

    public function exercises()
    {
        return $this->belongsToMany(Exercise::class, 'workout_day_exercises')
            ->withPivot(['sets', 'reps', 'duration_minutes', 'order'])
            ->withTimestamps();
    }
}
