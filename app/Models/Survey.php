<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'published',
        'start_date',
        'end_date',
        'target_role',
    ];

    protected $casts = [
        'published' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class);
    }
}
