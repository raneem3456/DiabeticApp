import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { coachAPI } from '../../api/coach';
import { formatDate } from '../../utils/helpers';
import styles from './Exercises.module.css';

const Exercises = () => {
  const { user } = useAuthStore();
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    muscle_groups: '',
    equipment_needed: '',
    difficulty_level: 'beginner',
    duration_minutes: '',
    calories_burned: '',
    instructions: '',
    video_url: '',
    image_url: '',
    is_active: true
  });
  const { loading, error, callApi } = useApi();

  const fetchExercises = async () => {
    const result = await callApi(() => coachAPI.getExercises());
    if (result) {
      setExercises(result);
    }
  };

  useEffect(() => {
    fetchExercises();
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
      editingExercise 
        ? coachAPI.updateExercise(editingExercise.id, formData)
        : coachAPI.createExercise(formData)
    );
    
    if (result) {
      setShowForm(false);
      setEditingExercise(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        muscle_groups: '',
        equipment_needed: '',
        difficulty_level: 'beginner',
        duration_minutes: '',
        calories_burned: '',
        instructions: '',
        video_url: '',
        image_url: '',
        is_active: true
      });
      fetchExercises();
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name || '',
      description: exercise.description || '',
      category: exercise.category || '',
      muscle_groups: exercise.muscle_groups || '',
      equipment_needed: exercise.equipment_needed || '',
      difficulty_level: exercise.difficulty_level || 'beginner',
      duration_minutes: exercise.duration_minutes || '',
      calories_burned: exercise.calories_burned || '',
      instructions: exercise.instructions || '',
      video_url: exercise.video_url || '',
      image_url: exercise.image_url || '',
      is_active: exercise.is_active !== undefined ? exercise.is_active : true
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      const result = await callApi(() => coachAPI.deleteExercise(id));
      if (result) {
        fetchExercises();
      }
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return styles.beginner;
      case 'intermediate': return styles.intermediate;
      case 'advanced': return styles.advanced;
      default: return styles.beginner;
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'cardio': return styles.cardio;
      case 'strength': return styles.strength;
      case 'flexibility': return styles.flexibility;
      case 'balance': return styles.balance;
      case 'sports': return styles.sports;
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
        <h1>Exercises Management</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Exercise
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💪</div>
          <div className={styles.statContent}>
            <h3>Total Exercises</h3>
            <p>{exercises.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏃‍♂️</div>
          <div className={styles.statContent}>
            <h3>Cardio</h3>
            <p>{exercises.filter(ex => ex.category?.toLowerCase() === 'cardio').length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏋️‍♂️</div>
          <div className={styles.statContent}>
            <h3>Strength</h3>
            <p>{exercises.filter(ex => ex.category?.toLowerCase() === 'strength').length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statContent}>
            <h3>Average Rating</h3>
            <p>4.3</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingExercise ? 'Edit Exercise' : 'Add New Exercise'}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingExercise(null);
                  setFormData({
                    name: '',
                    description: '',
                    category: '',
                    muscle_groups: '',
                    equipment_needed: '',
                    difficulty_level: 'beginner',
                    duration_minutes: '',
                    calories_burned: '',
                    instructions: '',
                    video_url: '',
                    image_url: '',
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
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="">Select Category</option>
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="balance">Balance</option>
                    <option value="sports">Sports</option>
                    <option value="yoga">Yoga</option>
                    <option value="pilates">Pilates</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Difficulty Level</label>
                  <select name="difficulty_level" value={formData.difficulty_level} onChange={handleInputChange}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Calories Burned</label>
                  <input
                    type="number"
                    name="calories_burned"
                    value={formData.calories_burned}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Muscle Groups</label>
                  <input
                    type="text"
                    name="muscle_groups"
                    value={formData.muscle_groups}
                    onChange={handleInputChange}
                    placeholder="e.g., Legs, Arms, Core"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Equipment Needed</label>
                  <input
                    type="text"
                    name="equipment_needed"
                    value={formData.equipment_needed}
                    onChange={handleInputChange}
                    placeholder="e.g., Dumbbells, Resistance Band"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Video URL</label>
                  <input
                    type="url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
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
                  placeholder="Brief description of the exercise..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Instructions</label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Step-by-step instructions..."
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
                  Active Exercise
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingExercise ? 'Update Exercise' : 'Create Exercise'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingExercise(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Loading exercises...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Equipment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map(exercise => (
                <tr key={exercise.id}>
                  <td>
                    <div className={styles.exerciseInfo}>
                      {exercise.image_url && (
                        <img src={exercise.image_url} alt={exercise.name} className={styles.exerciseImage} />
                      )}
                      <div>
                        <strong>{exercise.name}</strong>
                        {exercise.description && (
                          <p className={styles.exerciseDescription}>{exercise.description}</p>
                        )}
                        {exercise.muscle_groups && (
                          <p className={styles.muscleGroups}>{exercise.muscle_groups}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.category} ${getCategoryColor(exercise.category)}`}>
                      {exercise.category || 'General'}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.difficulty} ${getDifficultyColor(exercise.difficulty_level)}`}>
                      {exercise.difficulty_level}
                    </span>
                  </td>
                  <td>{exercise.duration_minutes ? `${exercise.duration_minutes} min` : '-'}</td>
                  <td>{exercise.calories_burned ? `${exercise.calories_burned} kcal` : '-'}</td>
                  <td>
                    <span className={styles.equipment}>
                      {exercise.equipment_needed || 'None'}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.status} ${exercise.is_active ? styles.active : styles.inactive}`}>
                      {exercise.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {exercise.video_url && (
                        <button 
                          className={styles.videoButton}
                          onClick={() => window.open(exercise.video_url, '_blank')}
                        >
                          Watch
                        </button>
                      )}
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEdit(exercise)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(exercise.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Exercises;
