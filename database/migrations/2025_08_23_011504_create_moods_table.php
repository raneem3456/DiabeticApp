<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('moods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->enum('mood', ['excellent', 'good', 'neutral', 'bad', 'terrible']);
            $table->text('note')->nullable();
            $table->date('date');
            $table->timestamps();
            
            $table->index(['patient_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('moods');
    }
};
