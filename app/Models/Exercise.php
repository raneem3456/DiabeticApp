<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'level',
        'type',
        'equipment',
        'duration_minutes',
        'sets',
        'reps',
        'video_url',
        'image_url',
        'instructions',
        'safety_notes',
    ];

    public function workoutLogs()
    {
        return $this->hasMany(WorkoutLog::class);
    }

    public function workoutDayExercises()
    {
        return $this->hasMany(WorkoutDayExercise::class);
    }
}
