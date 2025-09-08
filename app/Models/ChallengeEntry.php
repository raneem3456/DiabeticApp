<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChallengeEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'challenge_id',
        'patient_id',
        'progress',
        'status',
        'started_at',
        'completed_at',
        'points_awarded',
    ];

    protected $casts = [
        'started_at' => 'date',
        'completed_at' => 'date',
        'points_awarded' => 'boolean',
    ];

    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
}
