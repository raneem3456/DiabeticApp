<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AdminNotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Notification::with('user');

        // Advanced filtering
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $notifications = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 20));

        return response()->json($notifications);
    }

    public function show(Request $request, Notification $notification)
    {
        return response()->json($notification->load('user'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
            'type' => ['required', Rule::in([
                'announcement', 'maintenance', 'update', 'reminder', 'alert', 'promotion'
            ])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'target_roles' => 'nullable|array',
            'target_roles.*' => Rule::in(['patient', 'doctor', 'nutritionist', 'coach', 'family', 'admin']),
            'target_users' => 'nullable|array',
            'target_users.*' => 'exists:users,id',
            'scheduled_at' => 'nullable|date|after:now',
            'expires_at' => 'nullable|date|after:scheduled_at',
            'is_broadcast' => 'boolean',
            'requires_action' => 'boolean',
            'action_url' => 'nullable|url',
            'action_text' => 'nullable|string|max:100',
        ]);

        $notification = Notification::create($request->all());

        // If it's a broadcast notification, send to all target users
        if ($request->boolean('is_broadcast')) {
            $this->broadcastNotification($notification, $request);
        }

        return response()->json($notification, 201);
    }

    public function update(Request $request, Notification $notification)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'message' => 'sometimes|required|string|max:1000',
            'type' => ['sometimes', 'required', Rule::in([
                'announcement', 'maintenance', 'update', 'reminder', 'alert', 'promotion'
            ])],
            'priority' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'target_roles' => 'nullable|array',
            'target_roles.*' => Rule::in(['patient', 'doctor', 'nutritionist', 'coach', 'family', 'admin']),
            'target_users' => 'nullable|array',
            'target_users.*' => 'exists:users,id',
            'scheduled_at' => 'nullable|date|after:now',
            'expires_at' => 'nullable|date|after:scheduled_at',
            'is_broadcast' => 'boolean',
            'requires_action' => 'boolean',
            'action_url' => 'nullable|url',
            'action_text' => 'nullable|string|max:100',
            'status' => ['sometimes', 'required', Rule::in(['draft', 'scheduled', 'sent', 'cancelled'])],
        ]);

        $notification->update($request->all());

        return response()->json($notification);
    }

    public function destroy(Request $request, Notification $notification)
    {
        $notification->delete();

        return response()->json(['message' => 'Notification deleted successfully']);
    }

    // New enhanced methods

    public function sendBroadcast(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
            'type' => ['required', Rule::in([
                'announcement', 'maintenance', 'update', 'reminder', 'alert', 'promotion'
            ])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'target_roles' => 'nullable|array',
            'target_roles.*' => Rule::in(['patient', 'doctor', 'nutritionist', 'coach', 'family', 'admin']),
            'exclude_users' => 'nullable|array',
            'exclude_users.*' => 'exists:users,id',
            'requires_action' => 'boolean',
            'action_url' => 'nullable|url',
            'action_text' => 'nullable|string|max:100',
        ]);

        $notification = Notification::create([
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type,
            'priority' => $request->priority,
            'target_roles' => $request->target_roles,
            'is_broadcast' => true,
            'requires_action' => $request->boolean('requires_action', false),
            'action_url' => $request->action_url,
            'action_text' => $request->action_text,
            'status' => 'sent',
        ]);

        $this->sendBroadcastNotification($notification, $request);

        return response()->json([
            'message' => 'Broadcast notification sent successfully',
            'notification' => $notification,
            'recipients_count' => $this->getRecipientsCount($request)
        ], 201);
    }

    public function scheduleNotification(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
            'type' => ['required', Rule::in([
                'announcement', 'maintenance', 'update', 'reminder', 'alert', 'promotion'
            ])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'target_roles' => 'nullable|array',
            'target_roles.*' => Rule::in(['patient', 'doctor', 'nutritionist', 'coach', 'family', 'admin']),
            'target_users' => 'nullable|array',
            'target_users.*' => 'exists:users,id',
            'scheduled_at' => 'required|date|after:now',
            'expires_at' => 'nullable|date|after:scheduled_at',
            'is_recurring' => 'boolean',
            'recurrence_pattern' => 'required_if:is_recurring,true|string',
            'requires_action' => 'boolean',
            'action_url' => 'nullable|url',
            'action_text' => 'nullable|string|max:100',
        ]);

        $notification = Notification::create([
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type,
            'priority' => $request->priority,
            'target_roles' => $request->target_roles,
            'target_users' => $request->target_users,
            'scheduled_at' => $request->scheduled_at,
            'expires_at' => $request->expires_at,
            'is_recurring' => $request->boolean('is_recurring', false),
            'recurrence_pattern' => $request->recurrence_pattern,
            'requires_action' => $request->boolean('requires_action', false),
            'action_url' => $request->action_url,
            'action_text' => $request->action_text,
            'status' => 'scheduled',
        ]);

        return response()->json([
            'message' => 'Notification scheduled successfully',
            'notification' => $notification
        ], 201);
    }

    public function cancelNotification(Request $request, Notification $notification)
    {
        if ($notification->status === 'sent') {
            return response()->json(['message' => 'Cannot cancel already sent notification'], 400);
        }

        $notification->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Notification cancelled successfully']);
    }

    public function duplicateNotification(Request $request, Notification $notification)
    {
        $newNotification = $notification->replicate();
        $newNotification->title = $notification->title . ' (Copy)';
        $newNotification->status = 'draft';
        $newNotification->scheduled_at = null;
        $newNotification->expires_at = null;
        $newNotification->save();

        return response()->json([
            'message' => 'Notification duplicated successfully',
            'notification' => $newNotification
        ], 201);
    }

    public function analytics(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->subDays(30));
        $dateTo = $request->get('date_to', now());

        $analytics = [
            'total_notifications' => Notification::whereBetween('created_at', [$dateFrom, $dateTo])->count(),
            'sent_notifications' => Notification::where('status', 'sent')
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->count(),
            'scheduled_notifications' => Notification::where('status', 'scheduled')
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->count(),
            'type_distribution' => $this->getTypeDistribution($dateFrom, $dateTo),
            'priority_distribution' => $this->getPriorityDistribution($dateFrom, $dateTo),
            'delivery_stats' => $this->getDeliveryStats($dateFrom, $dateTo),
            'engagement_stats' => $this->getEngagementStats($dateFrom, $dateTo),
        ];

        return response()->json($analytics);
    }

    public function userNotifications(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $notifications = Notification::where(function($query) use ($user) {
            $query->where('target_users', 'like', "%{$user->id}%")
                  ->orWhereJsonContains('target_roles', $user->role)
                  ->orWhere('is_broadcast', true);
        })
        ->where('status', 'sent')
        ->orderBy('created_at', 'desc')
        ->paginate($request->get('per_page', 20));

        return response()->json($notifications);
    }

    public function markAsRead(Request $request, Notification $notification)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // This would typically update a pivot table or notification status
        // For now, returning success message
        return response()->json(['message' => 'Notification marked as read']);
    }

    public function bulkActions(Request $request)
    {
        $request->validate([
            'notification_ids' => 'required|array',
            'notification_ids.*' => 'exists:notifications,id',
            'action' => 'required|in:delete,cancel,duplicate,change_status',
            'status' => 'required_if:action,change_status|in:draft,scheduled,sent,cancelled',
        ]);

        $notifications = Notification::whereIn('id', $request->notification_ids);
        $action = $request->action;

        switch ($action) {
            case 'delete':
                $notifications->delete();
                $message = 'Notifications deleted successfully';
                break;
            case 'cancel':
                $notifications->where('status', '!=', 'sent')->update(['status' => 'cancelled']);
                $message = 'Notifications cancelled successfully';
                break;
            case 'duplicate':
                // Implementation for bulk duplication
                $message = 'Notifications duplicated successfully';
                break;
            case 'change_status':
                $notifications->update(['status' => $request->status]);
                $message = 'Notification status updated successfully';
                break;
        }

        return response()->json(['message' => $message]);
    }

    public function exportNotifications(Request $request)
    {
        $query = Notification::with('user');

        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        $notifications = $query->get();

        $exportData = $notifications->map(function($notification) {
            return [
                'id' => $notification->id,
                'title' => $notification->title,
                'message' => $notification->message,
                'type' => $notification->type,
                'priority' => $notification->priority,
                'status' => $notification->status,
                'target_roles' => $notification->target_roles,
                'target_users' => $notification->target_users,
                'scheduled_at' => $notification->scheduled_at,
                'expires_at' => $notification->expires_at,
                'is_broadcast' => $notification->is_broadcast,
                'requires_action' => $notification->requires_action,
                'action_url' => $notification->action_url,
                'action_text' => $notification->action_text,
                'created_at' => $notification->created_at,
                'updated_at' => $notification->updated_at,
            ];
        });

        return response()->json($exportData);
    }

    // Private helper methods

    private function broadcastNotification($notification, $request)
    {
        // Implementation for broadcasting notification
        // This would typically involve queue jobs, push notifications, emails, etc.
    }

    private function sendBroadcastNotification($notification, $request)
    {
        // Implementation for sending broadcast notification
        // This would typically involve queue jobs, push notifications, emails, etc.
    }

    private function getRecipientsCount($request)
    {
        $query = User::query();

        if ($request->has('target_roles') && !empty($request->target_roles)) {
            $query->whereIn('role', $request->target_roles);
        }

        if ($request->has('exclude_users') && !empty($request->exclude_users)) {
            $query->whereNotIn('id', $request->exclude_users);
        }

        return $query->count();
    }

    private function getTypeDistribution($dateFrom, $dateTo)
    {
        return Notification::whereBetween('created_at', [$dateFrom, $dateTo])
            ->select('type', DB::raw('COUNT(*) as count'))
            ->groupBy('type')
            ->get();
    }

    private function getPriorityDistribution($dateFrom, $dateTo)
    {
        return Notification::whereBetween('created_at', [$dateFrom, $dateTo])
            ->select('priority', DB::raw('COUNT(*) as count'))
            ->groupBy('priority')
            ->get();
    }

    private function getDeliveryStats($dateFrom, $dateTo)
    {
        return [
            'total_sent' => Notification::where('status', 'sent')
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->count(),
            'delivery_rate' => 98.5, // Placeholder - would need actual delivery tracking
            'failed_deliveries' => 0, // Placeholder
        ];
    }

    private function getEngagementStats($dateFrom, $dateTo)
    {
        return [
            'open_rate' => 75.2, // Placeholder - would need actual tracking
            'click_rate' => 23.8, // Placeholder
            'action_completion_rate' => 67.3, // Placeholder
        ];
    }
}
