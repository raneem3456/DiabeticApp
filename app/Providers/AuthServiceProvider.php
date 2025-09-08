<?php

namespace App\Providers;

use App\Models\GlucoseReading;
use App\Models\DoctorNote;
use App\Models\MealPlan;
use App\Models\WorkoutPlan;
use App\Models\Medication;
use App\Models\Post;
use App\Models\Chat;
use App\Policies\GlucoseReadingPolicy;
use App\Policies\DoctorNotePolicy;
use App\Policies\MealPlanPolicy;
use App\Policies\WorkoutPlanPolicy;
use App\Policies\MedicationPolicy;
use App\Policies\PostPolicy;
use App\Policies\ChatPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        GlucoseReading::class => GlucoseReadingPolicy::class,
        DoctorNote::class => DoctorNotePolicy::class,
        MealPlan::class => MealPlanPolicy::class,
        WorkoutPlan::class => WorkoutPlanPolicy::class,
        Medication::class => MedicationPolicy::class,
        Post::class => PostPolicy::class,
        Chat::class => ChatPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
