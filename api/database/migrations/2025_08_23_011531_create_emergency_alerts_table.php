<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emergency_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['glucose_high', 'glucose_low', 'medication_missed', 'manual'])->default('manual');
            $table->text('description');
            $table->json('glucose_data')->nullable(); // for glucose-related alerts
            $table->timestamp('triggered_at');
            $table->json('sent_to')->nullable(); // array of contact IDs notified
            $table->enum('status', ['active', 'acknowledged', 'resolved'])->default('active');
            $table->timestamp('resolved_at')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->timestamps();
            
            $table->index(['patient_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emergency_alerts');
    }
};
