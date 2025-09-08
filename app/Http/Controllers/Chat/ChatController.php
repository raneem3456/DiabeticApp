<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $chats = $request->user()->chats()
            ->with(['participants', 'messages' => function($query) {
                $query->latest()->limit(1);
            }])
            ->orderBy('updated_at', 'desc')
            ->paginate(15);

        return response()->json($chats);
    }

    public function show(Request $request, Chat $chat)
    {
        $this->authorize('view', $chat);
        return response()->json($chat->load(['participants', 'messages.user']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'chat_type' => 'required|in:direct,group',
            'participant_ids' => 'required|array|min:1',
            'participant_ids.*' => 'exists:users,id',
        ]);

        $chat = Chat::create([
            'name' => $request->name,
            'chat_type' => $request->chat_type,
            'created_by' => $request->user()->id,
        ]);

        // Add participants including the creator
        $participantIds = array_merge($request->participant_ids, [$request->user()->id]);
        $chat->participants()->attach($participantIds);

        return response()->json($chat->load('participants'), 201);
    }

    public function update(Request $request, Chat $chat)
    {
        $this->authorize('update', $chat);

        $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        $chat->update($request->only(['name']));

        return response()->json($chat->load('participants'));
    }

    public function destroy(Request $request, Chat $chat)
    {
        $this->authorize('delete', $chat);
        $chat->delete();

        return response()->json(['message' => 'Chat deleted successfully']);
    }

    public function addParticipant(Request $request, Chat $chat)
    {
        $this->authorize('update', $chat);

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $chat->participants()->attach($request->user_id);

        return response()->json(['message' => 'Participant added successfully']);
    }

    public function removeParticipant(Request $request, Chat $chat)
    {
        $this->authorize('update', $chat);

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $chat->participants()->detach($request->user_id);

        return response()->json(['message' => 'Participant removed successfully']);
    }

    public function markAsRead(Request $request, Chat $chat)
    {
        $this->authorize('view', $chat);
        
        $chat->messages()
            ->where('user_id', '!=', $request->user()->id)
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Chat marked as read']);
    }
}
