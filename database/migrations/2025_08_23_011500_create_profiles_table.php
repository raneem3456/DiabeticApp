<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('diabetes_type', ['type1', 'type2', 'gestational', 'prediabetes', 'other'])->nullable();
            $table->decimal('weight', 5, 2)->nullable(); // in kg
            $table->decimal('height', 5, 2)->nullable(); // in cm
            $table->decimal('target_glucose_min', 4, 1)->nullable(); // mg/dL
            $table->decimal('target_glucose_max', 4, 1)->nullable(); // mg/dL
            $table->date('diagnosis_date')->nullable();
            $table->text('medical_history')->nullable();
            $table->text('allergies')->nullable();
            $table->text('medications')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relation')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
