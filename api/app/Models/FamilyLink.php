<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FamilyLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'family_user_id',
        'relation',
        'is_primary_contact',
        'can_view_medical_data',
        'can_receive_alerts',
    ];

    protected $casts = [
        'is_primary_contact' => 'boolean',
        'can_view_medical_data' => 'boolean',
        'can_receive_alerts' => 'boolean',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function familyMember()
    {
        return $this->belongsTo(User::class, 'family_user_id');
    }
}
