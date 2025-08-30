<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkoutLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'exercise_id',
        'exercise_name',
        'sets',
        'reps',
        'duration_minutes',
        'notes',
        'logged_at',
    ];

    protected $casts = [
        'logged_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function exercise()
    {
        return $this->belongsTo(Exercise::class);
    }
}
