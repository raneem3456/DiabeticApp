<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GlucoseReading extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'value',
        'unit',
        'source',
        'meal_context',
        'notes',
        'measured_at',
    ];

    protected $casts = [
        'value' => 'decimal:1',
        'measured_at' => 'datetime',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
}
