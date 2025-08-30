<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reward;
use Illuminate\Http\Request;

class RewardController extends Controller
{
    public function index(Request $request)
    {
        $rewards = Reward::orderBy('points_required', 'asc')
            ->paginate(15);

        return response()->json($rewards);
    }

    public function show(Request $request, Reward $reward)
    {
        $this->authorize('view', $reward);
        return response()->json($reward);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'points_required' => 'required|integer|min:1',
            'reward_type' => 'required|in:badge,coupon,discount,achievement',
            'reward_value' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $reward = Reward::create([
            'name' => $request->name,
            'description' => $request->description,
            'points_required' => $request->points_required,
            'reward_type' => $request->reward_type,
            'reward_value' => $request->reward_value,
            'is_active' => $request->is_active ?? true,
            'expires_at' => $request->expires_at,
        ]);

        return response()->json($reward, 201);
    }

    public function update(Request $request, Reward $reward)
    {
        $this->authorize('update', $reward);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'points_required' => 'sometimes|required|integer|min:1',
            'reward_type' => 'sometimes|required|in:badge,coupon,discount,achievement',
            'reward_value' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'expires_at' => 'nullable|date',
        ]);

        $reward->update($request->only([
            'name', 'description', 'points_required', 'reward_type', 
            'reward_value', 'is_active', 'expires_at'
        ]));

        return response()->json($reward);
    }

    public function destroy(Request $request, Reward $reward)
    {
        $this->authorize('delete', $reward);
        $reward->delete();

        return response()->json(['message' => 'Reward deleted successfully']);
    }
}
