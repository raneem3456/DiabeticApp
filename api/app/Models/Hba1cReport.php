<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hba1cReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'value',
        'unit',
        'test_date',
        'lab_name',
        'notes',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'test_date' => 'date',
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
}
