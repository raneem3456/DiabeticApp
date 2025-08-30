<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nutrition_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('meal_id')->nullable()->constrained('meals');
            $table->string('meal_name')->nullable(); // for custom meals
            $table->decimal('carbs', 6, 2)->nullable();
            $table->decimal('protein', 6, 2)->nullable();
            $table->decimal('fat', 6, 2)->nullable();
            $table->integer('kcal')->nullable();
            $table->enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);
            $table->text('notes')->nullable();
            $table->timestamp('logged_at');
            $table->timestamps();
            
            $table->index(['patient_id', 'logged_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nutrition_logs');
    }
};
