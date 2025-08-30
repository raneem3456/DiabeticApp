<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hba1c_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->decimal('value', 4, 2); // HbA1c percentage
            $table->enum('unit', ['%', 'mmol/mol'])->default('%');
            $table->date('test_date');
            $table->string('lab_name')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['patient_id', 'test_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hba1c_reports');
    }
};
