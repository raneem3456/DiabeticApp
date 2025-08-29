import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { adminAPI } from '../../api/admin';
import { formatDate } from '../../utils/helpers';
import styles from './Surveys.module.css';

const Surveys = () => {
  const { user } = useAuthStore();
  const [surveys, setSurveys] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_active: true,
    start_date: '',
    end_date: '',
    target_audience: '',
    reward_points: ''
  });
  const { loading, error, callApi } = useApi();

  const fetchSurveys = async () => {
    const result = await callApi(adminAPI.getSurveys);
    if (result) {
      setSurveys(result);
    }
  };

  useEffect(() => {
    fetchSurveys();
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
    const apiCall = editingSurvey 
      ? () => adminAPI.updateSurvey(editingSurvey.id, formData)
      : () => adminAPI.createSurvey(formData);
    
    const result = await callApi(apiCall);
    if (result) {
      setShowForm(false);
      setEditingSurvey(null);
      setFormData({
        title: '',
        description: '',
        is_active: true,
        start_date: '',
        end_date: '',
        target_audience: '',
        reward_points: ''
      });
      fetchSurveys();
    }
  };

  const handleEdit = (survey) => {
    setEditingSurvey(survey);
    setFormData({
      title: survey.title,
      description: survey.description,
      is_active: survey.is_active,
      start_date: survey.start_date,
      end_date: survey.end_date,
      target_audience: survey.target_audience,
      reward_points: survey.reward_points
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      const result = await callApi(() => adminAPI.deleteSurvey(id));
      if (result) {
        fetchSurveys();
      }
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? styles.active : styles.inactive;
  };

  const getTargetAudienceColor = (audience) => {
    const colors = {
      'all': styles.audienceAll,
      'patients': styles.audiencePatients,
      'doctors': styles.audienceDoctors,
      'nutritionists': styles.audienceNutritionists,
      'coaches': styles.audienceCoaches
    };
    return colors[audience] || styles.audienceAll;
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
        <h1>Surveys Management</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Survey
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statInfo}>
            <h3>{surveys.length}</h3>
            <p>Total Surveys</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statInfo}>
            <h3>{surveys.filter(s => s.is_active).length}</h3>
            <p>Active Surveys</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statInfo}>
            <h3>{surveys.filter(s => s.target_audience === 'all').length}</h3>
            <p>General Surveys</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏆</div>
          <div className={styles.statInfo}>
            <h3>{surveys.reduce((sum, s) => sum + (s.reward_points || 0), 0)}</h3>
            <p>Total Reward Points</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingSurvey ? 'Edit Survey' : 'Add New Survey'}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingSurvey(null);
                  setFormData({
                    title: '',
                    description: '',
                    is_active: true,
                    start_date: '',
                    end_date: '',
                    target_audience: '',
                    reward_points: ''
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

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="target_audience">Target Audience</label>
                  <select
                    id="target_audience"
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleInputChange}
                  >
                    <option value="all">All Users</option>
                    <option value="patients">Patients Only</option>
                    <option value="doctors">Doctors Only</option>
                    <option value="nutritionists">Nutritionists Only</option>
                    <option value="coaches">Coaches Only</option>
                  </select>
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

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  Active Survey
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingSurvey ? 'Update Survey' : 'Create Survey'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingSurvey(null);
                    setFormData({
                      title: '',
                      description: '',
                      is_active: true,
                      start_date: '',
                      end_date: '',
                      target_audience: '',
                      reward_points: ''
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
          <div className={styles.loading}>Loading surveys...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Target Audience</th>
                <th>Status</th>
                <th>Reward Points</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map(survey => (
                <tr key={survey.id}>
                  <td>
                    <div className={styles.surveyTitle}>
                      <strong>{survey.title}</strong>
                    </div>
                  </td>
                  <td>
                    <div className={styles.surveyDescription}>
                      {survey.description || 'No description'}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.audienceBadge} ${getTargetAudienceColor(survey.target_audience)}`}>
                      {survey.target_audience || 'all'}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusColor(survey.is_active)}`}>
                      {survey.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <span className={styles.rewardPoints}>
                      {survey.reward_points || 0} pts
                    </span>
                  </td>
                  <td>{formatDate(survey.created_at)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEdit(survey)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(survey.id)}
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

export default Surveys;
