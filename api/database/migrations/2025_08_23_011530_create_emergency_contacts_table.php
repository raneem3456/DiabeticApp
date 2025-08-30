<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emergency_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('relation');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // if contact is also a user
            $table->boolean('is_primary')->default(false);
            $table->boolean('can_receive_alerts')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emergency_contacts');
    }
};
