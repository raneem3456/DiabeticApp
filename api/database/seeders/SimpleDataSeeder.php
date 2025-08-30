<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\GlucoseReading;
use App\Models\Hba1cReport;
use App\Models\Mood;
use App\Models\Meal;
use App\Models\Exercise;
use App\Models\DoctorNote;
use App\Models\DoctorRating;
use App\Models\Medication;
use App\Models\User;
use Illuminate\Database\Seeder;

class SimpleDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->createProfiles();
        $this->createGlucoseReadings();
        $this->createHba1cReports();
        $this->createMoods();
        $this->createMeals();
        $this->createExercises();
        $this->createDoctorNotes();
        $this->createDoctorRatings();
        $this->createMedications();
    }

    private function createProfiles()
    {
        $patients = User::where('role', 'patient')->get();
        
        foreach ($patients as $patient) {
            Profile::create([
                'user_id' => $patient->id,
                'diabetes_type' => 'type2',
                'weight' => 70,
                'height' => 170,
                'target_glucose_min' => 70,
                'target_glucose_max' => 180,
                'diagnosis_date' => now()->subYears(2),
                'medical_history' => 'Sample medical history',
                'allergies' => 'None known',
                'medications' => 'Current medications list',
                'emergency_contact_name' => 'Emergency Contact',
                'emergency_contact_phone' => '+1234567890',
                'emergency_contact_relation' => 'Spouse',
            ]);
        }
    }

    private function createGlucoseReadings()
    {
        $patients = User::where('role', 'patient')->get();
        
        foreach ($patients as $patient) {
            for ($i = 0; $i < 3; $i++) {
                GlucoseReading::create([
                    'patient_id' => $patient->id,
                    'value' => rand(70, 300),
                    'unit' => 'mg/dL',
                    'source' => 'finger_prick',
                    'meal_context' => 'fasting',
                    'notes' => 'Sample glucose reading',
                    'measured_at' => now()->subDays($i),
                ]);
            }
        }
    }

    private function createHba1cReports()
    {
        $patients = User::where('role', 'patient')->get();
        
        foreach ($patients as $patient) {
            Hba1cReport::create([
                'patient_id' => $patient->id,
                'value' => 6.5,
                'unit' => '%',
                'test_date' => now()->subMonths(3),
                'lab_name' => 'Sample Lab',
                'notes' => 'Sample HbA1c report',
            ]);
        }
    }

    private function createMoods()
    {
        $patients = User::where('role', 'patient')->get();
        
        foreach ($patients as $patient) {
            for ($i = 0; $i < 3; $i++) {
                Mood::create([
                    'patient_id' => $patient->id,
                    'mood' => 'good',
                    'note' => 'Sample mood entry',
                    'date' => now()->subDays($i)->toDateString(),
                ]);
            }
        }
    }

    private function createMeals()
    {
        for ($i = 0; $i < 5; $i++) {
            Meal::create([
                'name' => 'Sample Meal ' . ($i + 1),
                'description' => 'Sample meal description',
                'kcal' => 500,
                'carbs' => 50,
                'protein' => 25,
                'fat' => 15,
                'fiber' => 10,
                'sugar' => 20,
                'meal_type' => 'lunch',
                'is_vegetarian' => false,
                'is_vegan' => false,
                'is_gluten_free' => false,
            ]);
        }
    }

    private function createExercises()
    {
        for ($i = 0; $i < 5; $i++) {
            Exercise::create([
                'name' => 'Exercise ' . ($i + 1),
                'description' => 'Sample exercise description',
                'level' => 'beginner',
                'type' => 'cardio',
                'equipment' => 'none',
                'duration_minutes' => 30,
                'sets' => 3,
                'reps' => 10,
                'video_url' => 'https://example.com/video',
                'instructions' => 'Sample exercise instructions',
                'safety_notes' => 'Sample safety notes',
            ]);
        }
    }

    private function createDoctorNotes()
    {
        $patients = User::where('role', 'patient')->get();
        $doctors = User::where('role', 'doctor')->get();
        
        foreach ($patients as $patient) {
            $doctor = $doctors->first();
            
            DoctorNote::create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'note' => 'Sample doctor note for patient ' . $patient->name,
                'type' => 'consultation',
                'is_private' => false,
            ]);
        }
    }

    private function createDoctorRatings()
    {
        $patients = User::where('role', 'patient')->get();
        $doctors = User::where('role', 'doctor')->get();
        
        foreach ($patients as $patient) {
            $doctor = $doctors->first();
            
            DoctorRating::create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'rating' => 5,
                'review' => 'Sample doctor rating review',
                'is_anonymous' => false,
            ]);
        }
    }

    private function createMedications()
    {
        $patients = User::where('role', 'patient')->get();
        $doctors = User::where('role', 'doctor')->get();
        
        foreach ($patients as $patient) {
            $doctor = $doctors->first();
            
            Medication::create([
                'patient_id' => $patient->id,
                'prescribed_by' => $doctor->id,
                'name' => 'Metformin',
                'dosage' => '500mg',
                'frequency' => 'Twice daily',
                'route' => 'oral',
                'instructions' => 'Take with meals',
                'start_date' => now()->subDays(30),
                'end_date' => now()->addDays(60),
                'is_active' => true,
                'side_effects' => 'Sample side effects',
                'contraindications' => 'Sample contraindications',
                'pharmacy' => 'Sample Pharmacy',
                'prescription_number' => 'RX1234',
            ]);
        }
    }
}
