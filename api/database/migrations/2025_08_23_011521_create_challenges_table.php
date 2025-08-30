<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenges', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('type', ['glucose_tracking', 'exercise', 'nutrition', 'medication', 'general']);
            $table->integer('target_value')->nullable(); // target for the challenge
            $table->string('target_unit')->nullable(); // unit for the target
            $table->integer('points_reward')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenges');
    }
};
