<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('family_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('family_user_id')->constrained('users')->onDelete('cascade');
            $table->enum('relation', ['parent', 'child', 'spouse', 'sibling', 'grandparent', 'other']);
            $table->boolean('is_primary_contact')->default(false);
            $table->boolean('can_view_medical_data')->default(false);
            $table->boolean('can_receive_alerts')->default(true);
            $table->timestamps();
            
            $table->unique(['patient_id', 'family_user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_links');
    }
};
