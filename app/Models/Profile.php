<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'diabetes_type',
        'weight',
        'height',
        'target_glucose_min',
        'target_glucose_max',
        'diagnosis_date',
        'medical_history',
        'allergies',
        'medications',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relation',
    ];

    protected $casts = [
        'diagnosis_date' => 'date',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
        'target_glucose_min' => 'decimal:1',
        'target_glucose_max' => 'decimal:1',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
