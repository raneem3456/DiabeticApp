<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meal_plan_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meal_plan_id')->constrained()->onDelete('cascade');
            $table->integer('day'); // 1-7 for weekly plans
            $table->foreignId('breakfast_meal_id')->nullable()->constrained('meals');
            $table->foreignId('lunch_meal_id')->nullable()->constrained('meals');
            $table->foreignId('dinner_meal_id')->nullable()->constrained('meals');
            $table->foreignId('snack_meal_id')->nullable()->constrained('meals');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meal_plan_days');
    }
};
