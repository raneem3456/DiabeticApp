<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'message',
        'type',
        'priority',
        'target_roles',
        'target_users',
        'scheduled_at',
        'expires_at',
        'is_broadcast',
        'requires_action',
        'action_url',
        'action_text',
        'status',
        'is_recurring',
        'recurrence_pattern',
        'user_id',
    ];

    protected $casts = [
        'target_roles' => 'array',
        'target_users' => 'array',
        'scheduled_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_broadcast' => 'boolean',
        'requires_action' => 'boolean',
        'is_recurring' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'sent')
                    ->where(function($q) {
                        $q->whereNull('expires_at')
                          ->orWhere('expires_at', '>', now());
                    });
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled')
                    ->where('scheduled_at', '<=', now());
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Accessors
    public function getIsExpiredAttribute()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function getIsScheduledAttribute()
    {
        return $this->status === 'scheduled' && $this->scheduled_at && $this->scheduled_at->isFuture();
    }

    public function getIsActiveAttribute()
    {
        return $this->status === 'sent' && !$this->is_expired;
    }

    // Methods
    public function markAsSent()
    {
        $this->update(['status' => 'sent']);
    }

    public function markAsCancelled()
    {
        $this->update(['status' => 'cancelled']);
    }

    public function isTargetUser($user)
    {
        // Check if user is in target_users array
        if ($this->target_users && in_array($user->id, $this->target_users)) {
            return true;
        }

        // Check if user's role is in target_roles array
        if ($this->target_roles && in_array($user->role, $this->target_roles)) {
            return true;
        }

        // Check if it's a broadcast notification
        if ($this->is_broadcast) {
            return true;
        }

        return false;
    }
}
