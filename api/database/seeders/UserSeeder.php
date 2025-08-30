<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@diabetic.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'age' => 35,
            'gender' => 'male',
            'phone' => '+1234567890',
        ]);
        $admin->assignRole('admin');

        // Create sample patients
        $patients = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'role' => 'patient',
                'age' => 45,
                'gender' => 'male',
                'phone' => '+1234567891',
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'role' => 'patient',
                'age' => 38,
                'gender' => 'female',
                'phone' => '+1234567892',
            ],
            [
                'name' => 'Mike Johnson',
                'email' => 'mike@example.com',
                'role' => 'patient',
                'age' => 52,
                'gender' => 'male',
                'phone' => '+1234567893',
            ],
        ];

        foreach ($patients as $patientData) {
            $patient = User::create([
                'name' => $patientData['name'],
                'email' => $patientData['email'],
                'password' => Hash::make('password'),
                'role' => $patientData['role'],
                'age' => $patientData['age'],
                'gender' => $patientData['gender'],
                'phone' => $patientData['phone'],
            ]);
            $patient->assignRole('patient');
        }

        // Create sample doctors
        $doctors = [
            [
                'name' => 'Dr. Sarah Wilson',
                'email' => 'sarah.wilson@hospital.com',
                'role' => 'doctor',
                'age' => 42,
                'gender' => 'female',
                'phone' => '+1234567894',
            ],
            [
                'name' => 'Dr. Robert Chen',
                'email' => 'robert.chen@hospital.com',
                'role' => 'doctor',
                'age' => 48,
                'gender' => 'male',
                'phone' => '+1234567895',
            ],
        ];

        foreach ($doctors as $doctorData) {
            $doctor = User::create([
                'name' => $doctorData['name'],
                'email' => $doctorData['email'],
                'password' => Hash::make('password'),
                'role' => $doctorData['role'],
                'age' => $doctorData['age'],
                'gender' => $doctorData['gender'],
                'phone' => $doctorData['phone'],
            ]);
            $doctor->assignRole('doctor');
        }

        // Create sample nutritionists
        $nutritionists = [
            [
                'name' => 'Lisa Brown',
                'email' => 'lisa.brown@nutrition.com',
                'role' => 'nutritionist',
                'age' => 36,
                'gender' => 'female',
                'phone' => '+1234567896',
            ],
            [
                'name' => 'David Garcia',
                'email' => 'david.garcia@nutrition.com',
                'role' => 'nutritionist',
                'age' => 41,
                'gender' => 'male',
                'phone' => '+1234567897',
            ],
        ];

        foreach ($nutritionists as $nutritionistData) {
            $nutritionist = User::create([
                'name' => $nutritionistData['name'],
                'email' => $nutritionistData['email'],
                'password' => Hash::make('password'),
                'role' => $nutritionistData['role'],
                'age' => $nutritionistData['age'],
                'gender' => $nutritionistData['gender'],
                'phone' => $nutritionistData['phone'],
            ]);
            $nutritionist->assignRole('nutritionist');
        }

        // Create sample coaches
        $coaches = [
            [
                'name' => 'Alex Thompson',
                'email' => 'alex.thompson@fitness.com',
                'role' => 'coach',
                'age' => 33,
                'gender' => 'male',
                'phone' => '+1234567898',
            ],
            [
                'name' => 'Maria Rodriguez',
                'email' => 'maria.rodriguez@fitness.com',
                'role' => 'coach',
                'age' => 29,
                'gender' => 'female',
                'phone' => '+1234567899',
            ],
        ];

        foreach ($coaches as $coachData) {
            $coach = User::create([
                'name' => $coachData['name'],
                'email' => $coachData['email'],
                'password' => Hash::make('password'),
                'role' => $coachData['role'],
                'age' => $coachData['age'],
                'gender' => $coachData['gender'],
                'phone' => $coachData['phone'],
            ]);
            $coach->assignRole('coach');
        }

        // Create sample family members
        $families = [
            [
                'name' => 'Mary Doe',
                'email' => 'mary.doe@example.com',
                'role' => 'family',
                'age' => 43,
                'gender' => 'female',
                'phone' => '+1234567900',
            ],
            [
                'name' => 'Tom Smith',
                'email' => 'tom.smith@example.com',
                'role' => 'family',
                'age' => 40,
                'gender' => 'male',
                'phone' => '+1234567901',
            ],
        ];

        foreach ($families as $familyData) {
            $family = User::create([
                'name' => $familyData['name'],
                'email' => $familyData['email'],
                'password' => Hash::make('password'),
                'role' => $familyData['role'],
                'age' => $familyData['age'],
                'gender' => $familyData['gender'],
                'phone' => $familyData['phone'],
            ]);
            $family->assignRole('family');
        }
    }
}
