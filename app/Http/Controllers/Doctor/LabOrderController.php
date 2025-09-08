<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\LabOrder;
use App\Models\User;
use Illuminate\Http\Request;

class LabOrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->labOrders()
            ->with(['patient', 'doctor'])
            ->orderBy('order_date', 'desc')
            ->paginate(20);

        return response()->json($orders);
    }

    public function show(Request $request, LabOrder $labOrder)
    {
        $this->authorize('view', $labOrder);

        return response()->json($labOrder->load(['patient', 'doctor']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:users,id',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date|after:today',
            'notes' => 'nullable|string',
        ]);

        $order = $request->user()->labOrders()->create([
            'patient_id' => $request->patient_id,
            'doctor_id' => $request->user()->id,
            'type' => $request->type,
            'description' => $request->description,
            'order_date' => now(),
            'due_date' => $request->due_date,
            'notes' => $request->notes,
        ]);

        return response()->json($order->load(['patient', 'doctor']), 201);
    }

    public function update(Request $request, LabOrder $labOrder)
    {
        $this->authorize('update', $labOrder);

        $request->validate([
            'type' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:ordered,in_progress,completed,cancelled',
            'due_date' => 'nullable|date',
            'completed_date' => 'nullable|date',
            'result_file' => 'nullable|string',
            'results' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $labOrder->update($request->all());

        return response()->json($labOrder->load(['patient', 'doctor']));
    }

    public function destroy(Request $request, LabOrder $labOrder)
    {
        $this->authorize('delete', $labOrder);

        $labOrder->delete();

        return response()->json(['message' => 'Lab order deleted successfully']);
    }

    public function patientOrders(Request $request, User $patient)
    {
        $orders = $request->user()->labOrders()
            ->where('patient_id', $patient->id)
            ->with(['patient', 'doctor'])
            ->orderBy('order_date', 'desc')
            ->paginate(20);

        return response()->json($orders);
    }
}
