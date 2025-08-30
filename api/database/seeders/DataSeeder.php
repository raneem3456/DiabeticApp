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
use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\Challenge;
use App\Models\Reward;
use App\Models\Chat;
use App\Models\Message;
use App\Models\Post;
use App\Models\Comment;
use App\Models\EmergencyContact;
use App\Models\User;
use Illuminate\Database\Seeder;

class DataSeeder extends Seeder
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
        $this->createSurveys();
        $this->createChallenges();
        $this->createRewards();
        $this->createChats();
        $this->createPosts();
        $this->createEmergencyContacts();
    }

    private function createProfiles()
    {
        $patients = User::where('role', 'patient')->get();
        
        foreach ($patients as $patient) {
            Profile::create([
                'user_id' => $patient->id,
                'diabetes_type' => ['type1', 'type2', 'gestational'][array_rand(['type1', 'type2', 'gestational'])],
                'weight' => rand(50, 120),
                'height' => rand(150, 190),
                'target_glucose_min' => 70,
                'target_glucose_max' => 180,
                'diagnosis_date' => now()->subYears(rand(1, 10)),
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
            for ($i = 0; $i < 5; $i++) {
                GlucoseReading::create([
                    'patient_id' => $patient->id,
                    'value' => rand(70, 300),
                    'unit' => 'mg/dL',
                    'source' => 'finger_prick',
                    'meal_context' => ['fasting', 'before_meal', 'after_meal', 'bedtime'][array_rand(['fasting', 'before_meal', 'after_meal', 'bedtime'])],
                    'notes' => 'Sample glucose reading',
                    'measured_at' => now()->subDays(rand(0, 30)),
                ]);
            }
        }
    }

    private function createHba1cReports()
    {
        $patients = User::where('role', 'patient')->get();
        
        foreach ($patients as $patient) {
            for ($i = 0; $i < 2; $i++) {
                Hba1cReport::create([
                    'patient_id' => $patient->id,
                    'value' => rand(50, 120) / 10,
                    'unit' => '%',
                    'test_date' => now()->subMonths(rand(1, 12)),
                    'lab_name' => 'Sample Lab',
                    'notes' => 'Sample HbA1c report',
                ]);
            }
        }
    }

    private function createMoods()
    {
        $patients = User::where('role', 'patient')->get();
        
        foreach ($patients as $patient) {
            for ($i = 0; $i < 5; $i++) {
                Mood::create([
                    'patient_id' => $patient->id,
                    'mood' => ['excellent', 'good', 'neutral', 'bad', 'terrible'][array_rand(['excellent', 'good', 'neutral', 'bad', 'terrible'])],
                    'note' => 'Sample mood entry',
                    'date' => now()->subDays(rand(0, 30))->toDateString(),
                ]);
            }
        }
    }

    private function createMeals()
    {
        for ($i = 0; $i < 10; $i++) {
            Meal::create([
                'name' => 'Sample Meal ' . ($i + 1),
                'description' => 'Sample meal description',
                'kcal' => rand(200, 800),
                'carbs' => rand(20, 100),
                'protein' => rand(10, 50),
                'fat' => rand(5, 30),
                'fiber' => rand(2, 15),
                'sugar' => rand(5, 40),
                'meal_type' => ['breakfast', 'lunch', 'dinner', 'snack'][array_rand(['breakfast', 'lunch', 'dinner', 'snack'])],
                'is_vegetarian' => rand(0, 1),
                'is_vegan' => rand(0, 1),
                'is_gluten_free' => rand(0, 1),
            ]);
        }
    }

    private function createExercises()
    {
        for ($i = 0; $i < 10; $i++) {
            Exercise::create([
                'name' => 'Exercise ' . ($i + 1),
                'description' => 'Sample exercise description',
                'level' => ['beginner', 'intermediate', 'advanced'][array_rand(['beginner', 'intermediate', 'advanced'])],
                'type' => ['cardio', 'strength', 'flexibility', 'balance'][array_rand(['cardio', 'strength', 'flexibility', 'balance'])],
                'equipment' => ['none', 'dumbbells', 'resistance_band', 'yoga_mat'][array_rand(['none', 'dumbbells', 'resistance_band', 'yoga_mat'])],
                'duration_minutes' => rand(10, 60),
                'sets' => rand(1, 5),
                'reps' => rand(5, 20),
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
            $doctor = $doctors->random();
            
            for ($i = 0; $i < 2; $i++) {
                DoctorNote::create([
                    'patient_id' => $patient->id,
                    'doctor_id' => $doctor->id,
                    'note' => 'Sample doctor note for patient ' . $patient->name,
                    'type' => ['consultation', 'follow_up', 'emergency', 'routine'][array_rand(['consultation', 'follow_up', 'emergency', 'routine'])],
                    'is_private' => false,
                ]);
            }
        }
    }

    private function createDoctorRatings()
    {
        $patients = User::where('role', 'patient')->get();
        $doctors = User::where('role', 'doctor')->get();
        
        foreach ($patients as $patient) {
            $doctor = $doctors->random();
            
            DoctorRating::create([
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'rating' => rand(1, 5),
                'comment' => 'Sample doctor rating comment',
            ]);
        }
    }

    private function createMedications()
    {
        $patients = User::where('role', 'patient')->get();
        $doctors = User::where('role', 'doctor')->get();
        
        foreach ($patients as $patient) {
            $doctor = $doctors->random();
            
            for ($i = 0; $i < 2; $i++) {
                Medication::create([
                    'patient_id' => $patient->id,
                    'prescribed_by' => $doctor->id,
                    'name' => ['Metformin', 'Insulin', 'Glipizide'][array_rand(['Metformin', 'Insulin', 'Glipizide'])],
                    'dosage' => '500mg',
                    'frequency' => 'Twice daily',
                    'route' => 'oral',
                    'instructions' => 'Take with meals',
                    'start_date' => now()->subDays(rand(0, 30)),
                    'end_date' => now()->addDays(rand(30, 90)),
                    'is_active' => true,
                    'side_effects' => 'Sample side effects',
                    'contraindications' => 'Sample contraindications',
                    'pharmacy' => 'Sample Pharmacy',
                    'prescription_number' => 'RX' . rand(1000, 9999),
                ]);
            }
        }
    }

    private function createSurveys()
    {
        for ($i = 0; $i < 2; $i++) {
            $survey = Survey::create([
                'title' => 'Survey ' . ($i + 1),
                'description' => 'Sample survey description',
                'start_date' => now(),
                'end_date' => now()->addDays(30),
                'is_active' => true,
                'target_audience' => ['all', 'patients', 'doctors'][array_rand(['all', 'patients', 'doctors'])],
            ]);

            // Create survey questions
            for ($j = 0; $j < 2; $j++) {
                SurveyQuestion::create([
                    'survey_id' => $survey->id,
                    'question_text' => 'Sample question ' . ($j + 1) . '?',
                    'question_type' => ['multiple_choice', 'text', 'rating'][array_rand(['multiple_choice', 'text', 'rating'])],
                    'options' => ['Option 1', 'Option 2', 'Option 3'],
                    'required' => true,
                    'order' => $j + 1,
                ]);
            }
        }
    }

    private function createChallenges()
    {
        for ($i = 0; $i < 2; $i++) {
            Challenge::create([
                'title' => 'Challenge ' . ($i + 1),
                'description' => 'Sample challenge description',
                'challenge_type' => ['glucose_control', 'exercise', 'nutrition', 'medication'][array_rand(['glucose_control', 'exercise', 'nutrition', 'medication'])],
                'target_value' => rand(10, 100),
                'unit' => ['steps', 'glucose_readings', 'workouts'][array_rand(['steps', 'glucose_readings', 'workouts'])],
                'start_date' => now(),
                'end_date' => now()->addDays(30),
                'reward_points' => rand(50, 500),
                'is_active' => true,
            ]);
        }
    }

    private function createRewards()
    {
        for ($i = 0; $i < 3; $i++) {
            Reward::create([
                'name' => 'Reward ' . ($i + 1),
                'description' => 'Sample reward description',
                'points_required' => rand(100, 1000),
                'reward_type' => ['badge', 'coupon', 'discount', 'achievement'][array_rand(['badge', 'coupon', 'discount', 'achievement'])],
                'reward_value' => 'Sample reward value',
                'is_active' => true,
                'expires_at' => now()->addDays(90),
            ]);
        }
    }

    private function createChats()
    {
        $users = User::all();
        
        for ($i = 0; $i < 2; $i++) {
            $participants = $users->random(rand(2, 4));
            
            $chat = Chat::create([
                'name' => 'Chat ' . ($i + 1),
                'chat_type' => 'group',
                'created_by' => $participants->first()->id,
            ]);

            $chat->participants()->attach($participants->pluck('id'));

            // Create messages
            foreach ($participants as $participant) {
                Message::create([
                    'chat_id' => $chat->id,
                    'sender_id' => $participant->id,
                    'content' => 'Sample message from ' . $participant->name,
                    'message_type' => 'text',
                ]);
            }
        }
    }

    private function createPosts()
    {
        $users = User::all();
        
        foreach ($users as $user) {
            $post = Post::create([
                'user_id' => $user->id,
                'title' => 'Post by ' . $user->name,
                'content' => 'Sample post content',
                'category' => ['general', 'education', 'support', 'success_story'][array_rand(['general', 'education', 'support', 'success_story'])],
                'is_public' => true,
                'tags' => ['diabetes', 'health', 'support'],
                'likes_count' => rand(0, 50),
            ]);

            // Create comments
            for ($j = 0; $j < rand(1, 2); $j++) {
                $commenter = $users->random();
                Comment::create([
                    'post_id' => $post->id,
                    'user_id' => $commenter->id,
                    'content' => 'Sample comment by ' . $commenter->name,
                    'likes_count' => rand(0, 10),
                ]);
            }
        }
    }

    private function createEmergencyContacts()
    {
        $patients = User::where('role', 'patient')->get();
        
        foreach ($patients as $patient) {
            EmergencyContact::create([
                'patient_id' => $patient->id,
                'name' => 'Emergency Contact for ' . $patient->name,
                'phone' => '+1234567890',
                'email' => 'emergency@example.com',
                'relationship' => 'Spouse',
                'is_primary' => true,
                'can_receive_alerts' => true,
            ]);
        }
    }
}
