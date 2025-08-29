import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { adminAPI } from '../../api/admin';
import { formatDate } from '../../utils/helpers';
import styles from './Challenges.module.css';

const Challenges = () => {
  const { user } = useAuthStore();
  const [challenges, setChallenges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    challenge_type: '',
    target_value: '',
    reward_points: '',
    start_date: '',
    end_date: '',
    is_active: true,
    difficulty_level: 'easy'
  });
  const { loading, error, callApi } = useApi();

  const fetchChallenges = async () => {
    const result = await callApi(adminAPI.getChallenges);
    if (result) {
      setChallenges(result);
    }
  };

  useEffect(() => {
    fetchChallenges();
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
    const apiCall = editingChallenge 
      ? () => adminAPI.updateChallenge(editingChallenge.id, formData)
      : () => adminAPI.createChallenge(formData);
    
    const result = await callApi(apiCall);
    if (result) {
      setShowForm(false);
      setEditingChallenge(null);
      setFormData({
        title: '',
        description: '',
        challenge_type: '',
        target_value: '',
        reward_points: '',
        start_date: '',
        end_date: '',
        is_active: true,
        difficulty_level: 'easy'
      });
      fetchChallenges();
    }
  };

  const handleEdit = (challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      challenge_type: challenge.challenge_type,
      target_value: challenge.target_value,
      reward_points: challenge.reward_points,
      start_date: challenge.start_date,
      end_date: challenge.end_date,
      is_active: challenge.is_active,
      difficulty_level: challenge.difficulty_level
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      const result = await callApi(() => adminAPI.deleteChallenge(id));
      if (result) {
        fetchChallenges();
      }
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? styles.active : styles.inactive;
  };

  const getDifficultyColor = (level) => {
    const colors = {
      'easy': styles.difficultyEasy,
      'medium': styles.difficultyMedium,
      'hard': styles.difficultyHard
    };
    return colors[level] || styles.difficultyEasy;
  };

  const getChallengeTypeColor = (type) => {
    const colors = {
      'glucose_tracking': styles.typeGlucose,
      'exercise': styles.typeExercise,
      'nutrition': styles.typeNutrition,
      'medication': styles.typeMedication,
      'weight_loss': styles.typeWeight,
      'general': styles.typeGeneral
    };
    return colors[type] || styles.typeGeneral;
  };

  if (user?.role !== 'admin') {
    return (
      <div className={styles.accessDenied}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Challenges Management</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Challenge
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statInfo}>
            <h3>{challenges.length}</h3>
            <p>Total Challenges</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statInfo}>
            <h3>{challenges.filter(c => c.is_active).length}</h3>
            <p>Active Challenges</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statInfo}>
            <h3>{challenges.filter(c => c.challenge_type === 'glucose_tracking').length}</h3>
            <p>Glucose Challenges</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💪</div>
          <div className={styles.statInfo}>
            <h3>{challenges.filter(c => c.challenge_type === 'exercise').length}</h3>
            <p>Exercise Challenges</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingChallenge ? 'Edit Challenge' : 'Add New Challenge'}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingChallenge(null);
                  setFormData({
                    title: '',
                    description: '',
                    challenge_type: '',
                    target_value: '',
                    reward_points: '',
                    start_date: '',
                    end_date: '',
                    is_active: true,
                    difficulty_level: 'easy'
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="challenge_type">Challenge Type</label>
                  <select
                    id="challenge_type"
                    name="challenge_type"
                    value={formData.challenge_type}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Type</option>
                    <option value="glucose_tracking">Glucose Tracking</option>
                    <option value="exercise">Exercise</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="medication">Medication</option>
                    <option value="weight_loss">Weight Loss</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="difficulty_level">Difficulty Level</label>
                  <select
                    id="difficulty_level"
                    name="difficulty_level"
                    value={formData.difficulty_level}
                    onChange={handleInputChange}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="target_value">Target Value</label>
                  <input
                    type="text"
                    id="target_value"
                    name="target_value"
                    value={formData.target_value}
                    onChange={handleInputChange}
                    placeholder="e.g., 30 days, 100 readings"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reward_points">Reward Points</label>
                  <input
                    type="number"
                    id="reward_points"
                    name="reward_points"
                    value={formData.reward_points}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="start_date">Start Date</label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="end_date">End Date</label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  Active Challenge
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingChallenge ? 'Update Challenge' : 'Create Challenge'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingChallenge(null);
                    setFormData({
                      title: '',
                      description: '',
                      challenge_type: '',
                      target_value: '',
                      reward_points: '',
                      start_date: '',
                      end_date: '',
                      is_active: true,
                      difficulty_level: 'easy'
                    });
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
          <div className={styles.loading}>Loading challenges...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Target</th>
                <th>Reward Points</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map(challenge => (
                <tr key={challenge.id}>
                  <td>
                    <div className={styles.challengeTitle}>
                      <strong>{challenge.title}</strong>
                      <div className={styles.challengeDescription}>
                        {challenge.description || 'No description'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.typeBadge} ${getChallengeTypeColor(challenge.challenge_type)}`}>
                      {challenge.challenge_type?.replace('_', ' ') || 'general'}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.difficultyBadge} ${getDifficultyColor(challenge.difficulty_level)}`}>
                      {challenge.difficulty_level}
                    </span>
                  </td>
                  <td>
                    <span className={styles.targetValue}>
                      {challenge.target_value || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={styles.rewardPoints}>
                      {challenge.reward_points || 0} pts
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusColor(challenge.is_active)}`}>
                      {challenge.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.duration}>
                      {challenge.start_date && challenge.end_date ? (
                        <>
                          <div>{formatDate(challenge.start_date)}</div>
                          <div>to {formatDate(challenge.end_date)}</div>
                        </>
                      ) : (
                        'No dates set'
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEdit(challenge)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(challenge.id)}
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

export default Challenges;
