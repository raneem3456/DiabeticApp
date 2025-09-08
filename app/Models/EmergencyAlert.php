<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmergencyAlert extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'type',
        'description',
        'glucose_data',
        'triggered_at',
        'sent_to',
        'status',
        'resolved_at',
        'resolution_notes',
    ];

    protected $casts = [
        'glucose_data' => 'array',
        'sent_to' => 'array',
        'triggered_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
}
