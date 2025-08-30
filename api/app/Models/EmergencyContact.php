<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmergencyContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'name',
        'relation',
        'phone',
        'email',
        'user_id',
        'is_primary',
        'can_receive_alerts',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'can_receive_alerts' => 'boolean',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
