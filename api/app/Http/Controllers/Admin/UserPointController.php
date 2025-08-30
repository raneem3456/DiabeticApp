<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserPoints;
use Illuminate\Http\Request;

class UserPointController extends Controller
{
    public function index(Request $request)
    {
        $userPoints = UserPoints::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($userPoints);
    }

    public function show(Request $request, UserPoints $userPoint)
    {
        $this->authorize('view', $userPoint);
        return response()->json($userPoint->load('user'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'points' => 'required|integer',
            'activity_type' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'reference_type' => 'nullable|string|max:100',
            'reference_id' => 'nullable|integer',
        ]);

        $userPoint = UserPoints::create([
            'user_id' => $request->user_id,
            'points' => $request->points,
            'activity_type' => $request->activity_type,
            'description' => $request->description,
            'reference_type' => $request->reference_type,
            'reference_id' => $request->reference_id,
        ]);

        return response()->json($userPoint->load('user'), 201);
    }

    public function update(Request $request, UserPoints $userPoint)
    {
        $this->authorize('update', $userPoint);

        $request->validate([
            'points' => 'sometimes|required|integer',
            'activity_type' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string|max:500',
            'reference_type' => 'nullable|string|max:100',
            'reference_id' => 'nullable|integer',
        ]);

        $userPoint->update($request->only([
            'points', 'activity_type', 'description', 'reference_type', 'reference_id'
        ]));

        return response()->json($userPoint->load('user'));
    }

    public function destroy(Request $request, UserPoints $userPoint)
    {
        $this->authorize('delete', $userPoint);
        $userPoint->delete();

        return response()->json(['message' => 'User points record deleted successfully']);
    }

    public function userTotal(Request $request, $userId)
    {
        $total = UserPoints::where('user_id', $userId)->sum('points');
        
        return response()->json([
            'user_id' => $userId,
            'total_points' => $total
        ]);
    }
}
