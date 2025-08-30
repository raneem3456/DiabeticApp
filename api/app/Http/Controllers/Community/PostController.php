<?php

namespace App\Http\Controllers\Community;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with(['user', 'comments'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($posts);
    }

    public function show(Request $request, Post $post)
    {
        $this->authorize('view', $post);
        return response()->json($post->load(['user', 'comments.user']));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:5000',
            'category' => 'required|in:general,education,support,success_story,question',
            'is_public' => 'boolean',
            'tags' => 'nullable|array',
        ]);

        $post = $request->user()->posts()->create([
            'title' => $request->title,
            'content' => $request->content,
            'category' => $request->category,
            'is_public' => $request->is_public ?? true,
            'tags' => $request->tags,
        ]);

        return response()->json($post->load('user'), 201);
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string|max:5000',
            'category' => 'sometimes|required|in:general,education,support,success_story,question',
            'is_public' => 'boolean',
            'tags' => 'nullable|array',
        ]);

        $post->update($request->only([
            'title', 'content', 'category', 'is_public', 'tags'
        ]));

        return response()->json($post->load('user'));
    }

    public function destroy(Request $request, Post $post)
    {
        $this->authorize('delete', $post);
        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }

    public function like(Request $request, Post $post)
    {
        $this->authorize('view', $post);
        
        $post->increment('likes_count');
        
        return response()->json(['message' => 'Post liked successfully']);
    }

    public function unlike(Request $request, Post $post)
    {
        $this->authorize('view', $post);
        
        if ($post->likes_count > 0) {
            $post->decrement('likes_count');
        }
        
        return response()->json(['message' => 'Post unliked successfully']);
    }
}
