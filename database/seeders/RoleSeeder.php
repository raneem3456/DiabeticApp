<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $patient = Role::create(['name' => 'patient']);
        $child = Role::create(['name' => 'child']);
        $doctor = Role::create(['name' => 'doctor']);
        $nutritionist = Role::create(['name' => 'nutritionist']);
        $coach = Role::create(['name' => 'coach']);
        $family = Role::create(['name' => 'family']);
        $admin = Role::create(['name' => 'admin']);

        // Create permissions
        $permissions = [
            // Patient permissions
            'view_own_glucose_readings',
            'create_glucose_readings',
            'update_own_glucose_readings',
            'delete_own_glucose_readings',
            'view_own_profile',
            'update_own_profile',
            'view_own_nutrition_logs',
            'create_nutrition_logs',
            'view_own_workout_logs',
            'create_workout_logs',
            
            // Child permissions (basic patient functionality)
            'view_own_glucose_readings',
            'create_glucose_readings',
            'view_own_profile',
            'view_own_nutrition_logs',
            'view_own_workout_logs',
            'view_own_moods',
            'view_own_hba1c_reports',
            'view_own_challenge_entries',
            
            // Doctor permissions
            'view_patient_data',
            'create_doctor_notes',
            'view_doctor_notes',
            'create_lab_orders',
            'view_lab_orders',
            
            // Nutritionist permissions
            'manage_meals',
            'create_meal_plans',
            'view_meal_plans',
            
            // Coach permissions
            'manage_exercises',
            'create_workout_plans',
            'view_workout_plans',
            
            // Admin permissions
            'manage_surveys',
            'manage_challenges',
            'manage_rewards',
            'view_all_data',
            
            // Family permissions (advanced patient management)
            'view_family_patient_data',
            'view_family_glucose_readings',
            'view_family_nutrition_logs',
            'view_family_workout_logs',
            'view_family_moods',
            'view_family_hba1c_reports',
            'view_family_challenge_entries',
            'view_family_medications',
            'view_family_doctor_notes',
            'create_family_emergency_contacts',
            'manage_family_emergency_alerts',
            'view_family_meal_plans',
            'view_family_workout_plans',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Assign permissions to roles
        $patient->givePermissionTo([
            'view_own_glucose_readings',
            'create_glucose_readings',
            'update_own_glucose_readings',
            'delete_own_glucose_readings',
            'view_own_profile',
            'update_own_profile',
            'view_own_nutrition_logs',
            'create_nutrition_logs',
            'view_own_workout_logs',
            'create_workout_logs',
        ]);

        $child->givePermissionTo([
            'view_own_glucose_readings',
            'create_glucose_readings',
            'view_own_profile',
            'view_own_nutrition_logs',
            'view_own_workout_logs',
            'view_own_moods',
            'view_own_hba1c_reports',
            'view_own_challenge_entries',
        ]);

        $doctor->givePermissionTo([
            'view_patient_data',
            'create_doctor_notes',
            'view_doctor_notes',
            'create_lab_orders',
            'view_lab_orders',
        ]);

        $nutritionist->givePermissionTo([
            'manage_meals',
            'create_meal_plans',
            'view_meal_plans',
        ]);

        $coach->givePermissionTo([
            'manage_exercises',
            'create_workout_plans',
            'view_workout_plans',
        ]);

        $family->givePermissionTo([
            'view_family_patient_data',
            'view_family_glucose_readings',
            'view_family_nutrition_logs',
            'view_family_workout_logs',
            'view_family_moods',
            'view_family_hba1c_reports',
            'view_family_challenge_entries',
            'view_family_medications',
            'view_family_doctor_notes',
            'create_family_emergency_contacts',
            'manage_family_emergency_alerts',
            'view_family_meal_plans',
            'view_family_workout_plans',
        ]);

        $admin->givePermissionTo(Permission::all());
    }
}
