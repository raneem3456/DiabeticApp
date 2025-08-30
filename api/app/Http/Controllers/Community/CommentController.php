<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $comments = Comment::with(['user', 'post'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($comments);
    }

    public function show(Request $request, Comment $comment)
    {
        $this->authorize('view', $comment);
        return response()->json($comment->load(['user', 'post']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = $request->user()->comments()->create([
            'post_id' => $request->post_id,
            'content' => $request->content,
            'parent_id' => $request->parent_id,
        ]);

        return response()->json($comment->load(['user', 'post']), 201);
    }

    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $request->validate([
            'content' => 'sometimes|required|string|max:1000',
        ]);

        $comment->update($request->only(['content']));

        return response()->json($comment->load(['user', 'post']));
    }

    public function destroy(Request $request, Comment $comment)
    {
        $this->authorize('delete', $comment);
        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }

    public function like(Request $request, Comment $comment)
    {
        $this->authorize('view', $comment);
        
        $comment->increment('likes_count');
        
        return response()->json(['message' => 'Comment liked successfully']);
    }

    public function unlike(Request $request, Comment $comment)
    {
        $this->authorize('view', $comment);
        
        if ($comment->likes_count > 0) {
            $comment->decrement('likes_count');
        }
        
        return response()->json(['message' => 'Comment unliked successfully']);
    }
}
