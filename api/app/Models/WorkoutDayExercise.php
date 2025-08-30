<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutDayExercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'workout_day_id',
        'exercise_id',
        'sets',
        'reps',
        'duration_minutes',
        'order',
    ];

    public function workoutDay()
    {
        return $this->belongsTo(WorkoutDay::class);
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}
