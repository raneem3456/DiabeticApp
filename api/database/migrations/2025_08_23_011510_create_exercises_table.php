<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('level', ['beginner', 'intermediate', 'advanced']);
            $table->enum('type', ['cardio', 'strength', 'flexibility', 'balance']);
            $table->enum('equipment', ['none', 'dumbbells', 'resistance_band', 'yoga_mat', 'other']);
            $table->integer('duration_minutes')->nullable();
            $table->integer('sets')->nullable();
            $table->integer('reps')->nullable();
            $table->string('video_url')->nullable();
            $table->string('image_url')->nullable();
            $table->text('instructions')->nullable();
            $table->text('safety_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};
