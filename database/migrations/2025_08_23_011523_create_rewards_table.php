<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rewards', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->integer('points_required');
            $table->string('image_url')->nullable();
            $table->enum('type', ['badge', 'discount', 'free_item', 'achievement'])->default('badge');
            $table->boolean('active')->default(true);
            $table->integer('stock')->nullable(); // null for unlimited
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rewards');
    }
};
