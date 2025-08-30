<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'age',
        'gender',
        'phone',
        'avatar_url',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function glucoseReadings()
    {
        return $this->hasMany(GlucoseReading::class, 'patient_id');
    }

    public function hba1cReports()
    {
        return $this->hasMany(Hba1cReport::class, 'patient_id');
    }

    public function moods()
    {
        return $this->hasMany(Mood::class, 'patient_id');
    }

    public function nutritionLogs()
    {
        return $this->hasMany(NutritionLog::class, 'patient_id');
    }

    public function workoutLogs()
    {
        return $this->hasMany(WorkoutLog::class, 'patient_id');
    }

    public function doctorNotes()
    {
        return $this->hasMany(DoctorNote::class, 'patient_id');
    }

    public function labOrders()
    {
        return $this->hasMany(LabOrder::class, 'patient_id');
    }

    public function doctorRatings()
    {
        return $this->hasMany(DoctorRating::class, 'patient_id');
    }

    public function mealPlans()
    {
        return $this->hasMany(MealPlan::class, 'patient_id');
    }

    public function workoutPlans()
    {
        return $this->hasMany(WorkoutPlan::class, 'patient_id');
    }

    public function challengeEntries()
    {
        return $this->hasMany(ChallengeEntry::class, 'patient_id');
    }

    public function emergencyContacts()
    {
        return $this->hasMany(EmergencyContact::class, 'patient_id');
    }

    public function emergencyAlerts()
    {
        return $this->hasMany(EmergencyAlert::class, 'patient_id');
    }

    public function familyLinks()
    {
        return $this->hasMany(FamilyLink::class, 'patient_id');
    }

    public function familyMembers()
    {
        return $this->hasMany(FamilyLink::class, 'family_user_id');
    }

    public function chats()
    {
        return $this->belongsToMany(Chat::class, 'chat_participants');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function userPoints()
    {
        return $this->hasOne(UserPoints::class);
    }

    public function medications()
    {
        return $this->hasMany(Medication::class, 'patient_id');
    }

    public function prescribedMedications()
    {
        return $this->hasMany(Medication::class, 'prescribed_by');
    }

    // Role-based relationships
    public function patientsAsDoctor()
    {
        return $this->hasMany(DoctorNote::class, 'doctor_id');
    }

    public function patientsAsNutritionist()
    {
        return $this->hasMany(MealPlan::class, 'nutritionist_id');
    }

    public function patientsAsCoach()
    {
        return $this->hasMany(WorkoutPlan::class, 'coach_id');
    }

    // Scopes
    public function scopePatients($query)
    {
        return $query->where('role', 'patient');
    }

    public function scopeDoctors($query)
    {
        return $query->where('role', 'doctor');
    }

    public function scopeNutritionists($query)
    {
        return $query->where('role', 'nutritionist');
    }

    public function scopeCoaches($query)
    {
        return $query->where('role', 'coach');
    }

    public function scopeFamilies($query)
    {
        return $query->where('role', 'family');
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }
}
