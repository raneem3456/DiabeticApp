<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenge_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challenge_id')->constrained()->onDelete('cascade');
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->integer('progress')->default(0);
            $table->enum('status', ['active', 'completed', 'abandoned'])->default('active');
            $table->date('started_at');
            $table->date('completed_at')->nullable();
            $table->boolean('points_awarded')->default(false);
            $table->timestamps();
            
            $table->unique(['challenge_id', 'patient_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenge_entries');
    }
};
