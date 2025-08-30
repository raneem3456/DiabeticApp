<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('glucose_readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->decimal('value', 5, 1); // glucose value
            $table->enum('unit', ['mg/dL', 'mmol/L'])->default('mg/dL');
            $table->enum('source', ['finger_prick', 'cgm', 'other'])->default('finger_prick');
            $table->enum('meal_context', ['fasting', 'before_meal', 'after_meal', 'bedtime', 'other'])->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('measured_at');
            $table->timestamps();
            
            $table->index(['patient_id', 'measured_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('glucose_readings');
    }
};
