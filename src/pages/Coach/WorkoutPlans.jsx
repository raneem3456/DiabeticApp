import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { coachAPI } from '../../api/coach';
import { formatDate } from '../../utils/helpers';
import styles from './WorkoutPlans.module.css';

const WorkoutPlans = () => {
  const { user } = useAuthStore();
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_weeks: '',
    frequency_per_week: '',
    target_audience: '',
    fitness_level: 'beginner',
    goals: '',
    total_workouts: '',
    estimated_calories_per_workout: '',
    is_active: true
  });
  const { loading, error, callApi } = useApi();

  const fetchWorkoutPlans = async () => {
    const result = await callApi(() => coachAPI.getWorkoutPlans());
    if (result) {
      setWorkoutPlans(result);
    }
  };

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await callApi(() => 
      editingPlan 
        ? coachAPI.updateWorkoutPlan(editingPlan.id, formData)
        : coachAPI.createWorkoutPlan(formData)
    );
    
    if (result) {
      setShowForm(false);
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        duration_weeks: '',
        frequency_per_week: '',
        target_audience: '',
        fitness_level: 'beginner',
        goals: '',
        total_workouts: '',
        estimated_calories_per_workout: '',
        is_active: true
      });
      fetchWorkoutPlans();
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      description: plan.description || '',
      duration_weeks: plan.duration_weeks || '',
      frequency_per_week: plan.frequency_per_week || '',
      target_audience: plan.target_audience || '',
      fitness_level: plan.fitness_level || 'beginner',
      goals: plan.goals || '',
      total_workouts: plan.total_workouts || '',
      estimated_calories_per_workout: plan.estimated_calories_per_workout || '',
      is_active: plan.is_active !== undefined ? plan.is_active : true
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      const result = await callApi(() => coachAPI.deleteWorkoutPlan(id));
      if (result) {
        fetchWorkoutPlans();
      }
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? styles.active : styles.inactive;
  };

  const getFitnessLevelColor = (level) => {
    switch (level) {
      case 'beginner': return styles.beginner;
      case 'intermediate': return styles.intermediate;
      case 'advanced': return styles.advanced;
      default: return styles.beginner;
    }
  };

  const getTargetAudienceColor = (audience) => {
    switch (audience?.toLowerCase()) {
      case 'diabetic': return styles.diabetic;
      case 'weight_loss': return styles.weightLoss;
      case 'muscle_gain': return styles.muscleGain;
      case 'endurance': return styles.endurance;
      case 'general_fitness': return styles.generalFitness;
      default: return styles.general;
    }
  };

  if (user?.role !== 'coach') {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Workout Plans Management</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Workout Plan
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <h3>Total Plans</h3>
            <p>{workoutPlans.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3>Active Plans</h3>
            <p>{workoutPlans.filter(plan => plan.is_active).length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Assigned Patients</h3>
            <p>8</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <h3>Average Rating</h3>
            <p>4.4</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingPlan ? 'Edit Workout Plan' : 'Add New Workout Plan'}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingPlan(null);
                  setFormData({
                    name: '',
                    description: '',
                    duration_weeks: '',
                    frequency_per_week: '',
                    target_audience: '',
                    fitness_level: 'beginner',
                    goals: '',
                    total_workouts: '',
                    estimated_calories_per_workout: '',
                    is_active: true
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Duration (weeks)</label>
                  <input
                    type="number"
                    name="duration_weeks"
                    value={formData.duration_weeks}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Frequency (per week)</label>
                  <input
                    type="number"
                    name="frequency_per_week"
                    value={formData.frequency_per_week}
                    onChange={handleInputChange}
                    min="1"
                    max="7"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Total Workouts</label>
                  <input
                    type="number"
                    name="total_workouts"
                    value={formData.total_workouts}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Fitness Level</label>
                  <select name="fitness_level" value={formData.fitness_level} onChange={handleInputChange}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Target Audience</label>
                  <select name="target_audience" value={formData.target_audience} onChange={handleInputChange}>
                    <option value="">Select Audience</option>
                    <option value="diabetic">Diabetic</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Calories per Workout</label>
                  <input
                    type="number"
                    name="estimated_calories_per_workout"
                    value={formData.estimated_calories_per_workout}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe the workout plan..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Goals</label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="e.g., Improve cardiovascular health, Build strength..."
                />
              </div>

              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  Active Plan
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingPlan ? 'Update Workout Plan' : 'Create Workout Plan'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingPlan(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.plansContainer}>
        {loading ? (
          <div className={styles.loading}>Loading workout plans...</div>
        ) : (
          <div className={styles.plansGrid}>
            {workoutPlans.map(plan => (
              <div key={plan.id} className={styles.planCard}>
                <div className={styles.planHeader}>
                  <div className={styles.planInfo}>
                    <h3>{plan.name}</h3>
                    <div className={styles.planMeta}>
                      <span className={`${styles.status} ${getStatusColor(plan.is_active)}`}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`${styles.fitnessLevel} ${getFitnessLevelColor(plan.fitness_level)}`}>
                        {plan.fitness_level}
                      </span>
                      {plan.target_audience && (
                        <span className={`${styles.audience} ${getTargetAudienceColor(plan.target_audience)}`}>
                          {plan.target_audience}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.planActions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEdit(plan)}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDelete(plan.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {plan.description && (
                  <p className={styles.planDescription}>{plan.description}</p>
                )}
                
                <div className={styles.planDetails}>
                  {plan.duration_weeks && (
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Duration:</span>
                      <span>{plan.duration_weeks} weeks</span>
                    </div>
                  )}
                  {plan.frequency_per_week && (
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Frequency:</span>
                      <span>{plan.frequency_per_week}x per week</span>
                    </div>
                  )}
                  {plan.total_workouts && (
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Total Workouts:</span>
                      <span>{plan.total_workouts}</span>
                    </div>
                  )}
                  {plan.estimated_calories_per_workout && (
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Calories/Workout:</span>
                      <span>{plan.estimated_calories_per_workout} kcal</span>
                    </div>
                  )}
                  {plan.goals && (
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Goals:</span>
                      <span>{plan.goals}</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.planFooter}>
                  <span className={styles.createdDate}>
                    Created: {formatDate(plan.created_at)}
                  </span>
                  <button className={styles.viewDetailsButton}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlans;
