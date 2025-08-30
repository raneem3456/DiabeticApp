<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function participants()
    {
        return $this->belongsToMany(User::class, 'chat_participants')
            ->withPivot(['is_admin', 'last_read_at'])
            ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
