<?php

namespace App\Http\Controllers\Emergency;

use App\Http\Controllers\Controller;
use App\Models\EmergencyContact;
use Illuminate\Http\Request;

class EmergencyContactController extends Controller
{
    public function index(Request $request)
    {
        $contacts = $request->user()->emergencyContacts()
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($contacts);
    }

    public function show(Request $request, EmergencyContact $emergencyContact)
    {
        $this->authorize('view', $emergencyContact);
        return response()->json($emergencyContact);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'relationship' => 'required|string|max:100',
            'is_primary' => 'boolean',
            'can_receive_alerts' => 'boolean',
        ]);

        // If this is the first contact, make it primary
        if ($request->user()->emergencyContacts()->count() === 0) {
            $request->merge(['is_primary' => true]);
        }

        // If setting as primary, unset other primary contacts
        if ($request->is_primary) {
            $request->user()->emergencyContacts()->update(['is_primary' => false]);
        }

        $contact = $request->user()->emergencyContacts()->create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'relationship' => $request->relationship,
            'is_primary' => $request->is_primary ?? false,
            'can_receive_alerts' => $request->can_receive_alerts ?? true,
        ]);

        return response()->json($contact, 201);
    }

    public function update(Request $request, EmergencyContact $emergencyContact)
    {
        $this->authorize('update', $emergencyContact);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'email' => 'nullable|email|max:255',
            'relationship' => 'sometimes|required|string|max:100',
            'is_primary' => 'boolean',
            'can_receive_alerts' => 'boolean',
        ]);

        // If setting as primary, unset other primary contacts
        if ($request->is_primary) {
            $request->user()->emergencyContacts()
                ->where('id', '!=', $emergencyContact->id)
                ->update(['is_primary' => false]);
        }

        $emergencyContact->update($request->only([
            'name', 'phone', 'email', 'relationship', 'is_primary', 'can_receive_alerts'
        ]));

        return response()->json($emergencyContact);
    }

    public function destroy(Request $request, EmergencyContact $emergencyContact)
    {
        $this->authorize('delete', $emergencyContact);
        $emergencyContact->delete();

        return response()->json(['message' => 'Emergency contact deleted successfully']);
    }
}
