<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meals', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('kcal');
            $table->decimal('carbs', 6, 2); // grams
            $table->decimal('protein', 6, 2); // grams
            $table->decimal('fat', 6, 2); // grams
            $table->decimal('fiber', 6, 2)->nullable(); // grams
            $table->decimal('sugar', 6, 2)->nullable(); // grams
            $table->enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);
            $table->boolean('is_vegetarian')->default(false);
            $table->boolean('is_vegan')->default(false);
            $table->boolean('is_gluten_free')->default(false);
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meals');
    }
};
