<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('prescribed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('name');
            $table->string('dosage');
            $table->string('frequency');
            $table->enum('route', ['oral', 'injection', 'inhalation', 'topical', 'other']);
            $table->text('instructions')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('side_effects')->nullable();
            $table->text('contraindications')->nullable();
            $table->string('pharmacy')->nullable();
            $table->string('prescription_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};
