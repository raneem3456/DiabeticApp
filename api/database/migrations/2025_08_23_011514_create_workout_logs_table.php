<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workout_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('exercise_id')->nullable()->constrained('exercises');
            $table->string('exercise_name')->nullable(); // for custom exercises
            $table->integer('sets')->nullable();
            $table->integer('reps')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('logged_at');
            $table->timestamps();
            
            $table->index(['patient_id', 'logged_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_logs');
    }
};
