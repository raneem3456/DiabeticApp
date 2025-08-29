import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { nutritionistAPI } from '../../api/nutritionist';
import { formatDate } from '../../utils/helpers';
import styles from './MealPlans.module.css';

const MealPlans = () => {
  const { user } = useAuthStore();
  const [mealPlans, setMealPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_weeks: '',
    total_calories: '',
    target_audience: '',
    dietary_restrictions: '',
    goals: '',
    is_active: true
  });
  const { loading, error, callApi } = useApi();

  const fetchMealPlans = async () => {
    const result = await callApi(() => nutritionistAPI.getMealPlans());
    if (result) {
      setMealPlans(result);
    }
  };

  useEffect(() => {
    fetchMealPlans();
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
        ? nutritionistAPI.updateMealPlan(editingPlan.id, formData)
        : nutritionistAPI.createMealPlan(formData)
    );
    
    if (result) {
      setShowForm(false);
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        duration_weeks: '',
        total_calories: '',
        target_audience: '',
        dietary_restrictions: '',
        goals: '',
        is_active: true
      });
      fetchMealPlans();
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      description: plan.description || '',
      duration_weeks: plan.duration_weeks || '',
      total_calories: plan.total_calories || '',
      target_audience: plan.target_audience || '',
      dietary_restrictions: plan.dietary_restrictions || '',
      goals: plan.goals || '',
      is_active: plan.is_active !== undefined ? plan.is_active : true
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      const result = await callApi(() => nutritionistAPI.deleteMealPlan(id));
      if (result) {
        fetchMealPlans();
      }
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? styles.active : styles.inactive;
  };

  const getTargetAudienceColor = (audience) => {
    switch (audience?.toLowerCase()) {
      case 'diabetic': return styles.diabetic;
      case 'weight_loss': return styles.weightLoss;
      case 'muscle_gain': return styles.muscleGain;
      case 'maintenance': return styles.maintenance;
      default: return styles.general;
    }
  };

  if (user?.role !== 'nutritionist') {
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
        <h1>Meal Plans Management</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Meal Plan
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <h3>Total Plans</h3>
            <p>{mealPlans.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3>Active Plans</h3>
            <p>{mealPlans.filter(plan => plan.is_active).length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Assigned Patients</h3>
            <p>12</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <h3>Average Rating</h3>
            <p>4.5</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingPlan ? 'Edit Meal Plan' : 'Add New Meal Plan'}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingPlan(null);
                  setFormData({
                    name: '',
                    description: '',
                    duration_weeks: '',
                    total_calories: '',
                    target_audience: '',
                    dietary_restrictions: '',
                    goals: '',
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
                  <label>Total Calories</label>
                  <input
                    type="number"
                    name="total_calories"
                    value={formData.total_calories}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Target Audience</label>
                  <select name="target_audience" value={formData.target_audience} onChange={handleInputChange}>
                    <option value="">Select Audience</option>
                    <option value="diabetic">Diabetic</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="general">General Health</option>
                  </select>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe the meal plan..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Dietary Restrictions</label>
                <textarea
                  name="dietary_restrictions"
                  value={formData.dietary_restrictions}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="e.g., Vegetarian, Gluten-free, Dairy-free..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Goals</label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="e.g., Blood sugar control, Weight management..."
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
                  {editingPlan ? 'Update Meal Plan' : 'Create Meal Plan'}
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
          <div className={styles.loading}>Loading meal plans...</div>
        ) : (
          <div className={styles.plansGrid}>
            {mealPlans.map(plan => (
              <div key={plan.id} className={styles.planCard}>
                <div className={styles.planHeader}>
                  <div className={styles.planInfo}>
                    <h3>{plan.name}</h3>
                    <div className={styles.planMeta}>
                      <span className={`${styles.status} ${getStatusColor(plan.is_active)}`}>
                        {plan.is_active ? 'Active' : 'Inactive'}
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
                  {plan.total_calories && (
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Calories:</span>
                      <span>{plan.total_calories} kcal</span>
                    </div>
                  )}
                  {plan.dietary_restrictions && (
                    <div className={styles.detail}>
                      <span className={styles.detailLabel}>Restrictions:</span>
                      <span>{plan.dietary_restrictions}</span>
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

export default MealPlans;
