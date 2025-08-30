<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->enum('type', ['article', 'discussion', 'question', 'experience'])->default('discussion');
            $table->string('image_url')->nullable();
            $table->boolean('published')->default(true);
            $table->integer('views')->default(0);
            $table->integer('likes')->default(0);
            $table->timestamps();
            
            $table->index(['type', 'published']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
