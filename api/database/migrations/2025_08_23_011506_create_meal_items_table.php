<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meal_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meal_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->decimal('grams', 6, 2); // serving size in grams
            $table->decimal('carbs', 6, 2); // grams
            $table->decimal('protein', 6, 2); // grams
            $table->decimal('fat', 6, 2); // grams
            $table->integer('kcal');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meal_items');
    }
};
