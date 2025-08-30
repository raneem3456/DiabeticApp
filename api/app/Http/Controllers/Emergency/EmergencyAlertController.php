<?php

namespace App\Http\Controllers\Emergency;

use App\Http\Controllers\Controller;
use App\Models\EmergencyAlert;
use Illuminate\Http\Request;

class EmergencyAlertController extends Controller
{
    public function index(Request $request)
    {
        $alerts = $request->user()->emergencyAlerts()
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($alerts);
    }

    public function show(Request $request, EmergencyAlert $emergencyAlert)
    {
        $this->authorize('view', $emergencyAlert);
        return response()->json($emergencyAlert);
    }

    public function store(Request $request)
    {
        $request->validate([
            'alert_type' => 'required|in:glucose_high,glucose_low,medication_missed,emergency_contact',
            'severity' => 'required|in:low,medium,high,critical',
            'message' => 'required|string|max:1000',
            'location' => 'nullable|string|max:255',
            'coordinates' => 'nullable|string|max:100',
            'triggered_by' => 'nullable|string|max:100',
            'trigger_value' => 'nullable|numeric',
        ]);

        $alert = $request->user()->emergencyAlerts()->create([
            'alert_type' => $request->alert_type,
            'severity' => $request->severity,
            'message' => $request->message,
            'location' => $request->location,
            'coordinates' => $request->coordinates,
            'triggered_by' => $request->triggered_by,
            'trigger_value' => $request->trigger_value,
            'status' => 'active',
        ]);

        // TODO: Send notifications to emergency contacts and healthcare providers
        // This would typically be handled by a job or event

        return response()->json($alert, 201);
    }

    public function update(Request $request, EmergencyAlert $emergencyAlert)
    {
        $this->authorize('update', $emergencyAlert);

        $request->validate([
            'status' => 'sometimes|required|in:active,acknowledged,resolved,false_alarm',
            'response_notes' => 'nullable|string|max:1000',
            'responded_by' => 'nullable|string|max:255',
            'response_time' => 'nullable|date',
        ]);

        $emergencyAlert->update($request->only([
            'status', 'response_notes', 'responded_by', 'response_time'
        ]));

        return response()->json($emergencyAlert);
    }

    public function destroy(Request $request, EmergencyAlert $emergencyAlert)
    {
        $this->authorize('delete', $emergencyAlert);
        $emergencyAlert->delete();

        return response()->json(['message' => 'Emergency alert deleted successfully']);
    }

    public function acknowledge(Request $request, EmergencyAlert $emergencyAlert)
    {
        $this->authorize('update', $emergencyAlert);
        
        $emergencyAlert->update([
            'status' => 'acknowledged',
            'response_time' => now(),
        ]);

        return response()->json(['message' => 'Alert acknowledged successfully']);
    }

    public function resolve(Request $request, EmergencyAlert $emergencyAlert)
    {
        $this->authorize('update', $emergencyAlert);
        
        $request->validate([
            'response_notes' => 'nullable|string|max:1000',
        ]);

        $emergencyAlert->update([
            'status' => 'resolved',
            'response_notes' => $request->response_notes,
            'response_time' => now(),
        ]);

        return response()->json(['message' => 'Alert resolved successfully']);
    }
}
