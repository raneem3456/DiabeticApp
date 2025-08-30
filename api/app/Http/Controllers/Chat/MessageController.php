<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'chat_id' => 'required|exists:chats,id',
        ]);

        $messages = Message::where('chat_id', $request->chat_id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($messages);
    }

    public function show(Request $request, Message $message)
    {
        $this->authorize('view', $message);
        return response()->json($message->load('user'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'chat_id' => 'required|exists:chats,id',
            'content' => 'required|string|max:2000',
            'message_type' => 'nullable|in:text,image,file',
        ]);

        $message = $request->user()->messages()->create([
            'chat_id' => $request->chat_id,
            'content' => $request->content,
            'message_type' => $request->message_type ?? 'text',
        ]);

        return response()->json($message->load('user'), 201);
    }

    public function update(Request $request, Message $message)
    {
        $this->authorize('update', $message);

        $request->validate([
            'content' => 'sometimes|required|string|max:2000',
        ]);

        $message->update($request->only(['content']));

        return response()->json($message->load('user'));
    }

    public function destroy(Request $request, Message $message)
    {
        $this->authorize('delete', $message);
        $message->delete();

        return response()->json(['message' => 'Message deleted successfully']);
    }

    public function markAsRead(Request $request, Message $message)
    {
        $this->authorize('view', $message);
        
        $message->update(['read_at' => now()]);

        return response()->json(['message' => 'Message marked as read']);
    }
}
