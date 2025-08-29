import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { patientAPI } from '../../api/patient';
import { formatDate, formatTime } from '../../utils/helpers';
import styles from './WorkoutLogs.module.css';

const WorkoutLogs = () => {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    exercise_type: 'cardio',
    duration: '',
    intensity: 'moderate',
    calories_burned: '',
    notes: ''
  });

  const { loading, error, callApi } = useApi();

  // Fetch workout logs
  const fetchLogs = async () => {
    const data = await callApi(patientAPI.getWorkoutLogs);
    if (data) {
      setLogs(data);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await callApi(() => patientAPI.createWorkoutLog(formData));
      
      setShowForm(false);
      setFormData({
        exercise_type: 'cardio',
        duration: '',
        intensity: 'moderate',
        calories_burned: '',
        notes: ''
      });
      fetchLogs();
    } catch (error) {
      console.error('Error creating workout log:', error);
    }
  };

  // Get exercise icon
  const getExerciseIcon = (type) => {
    const icons = {
      cardio: '🏃',
      strength: '💪',
      flexibility: '🧘',
      balance: '⚖️',
      sports: '⚽',
      walking: '🚶',
      running: '🏃',
      cycling: '🚴',
      swimming: '🏊',
      yoga: '🧘',
      pilates: '🤸',
      dancing: '💃',
      hiking: '🏔️',
      other: '🏋️'
    };
    return icons[type] || '🏋️';
  };

  // Get intensity color
  const getIntensityColor = (intensity) => {
    const colors = {
      low: 'low',
      moderate: 'moderate',
      high: 'high',
      very_high: 'very_high'
    };
    return colors[intensity] || 'moderate';
  };

  // Check if user has access
  if (user?.role !== 'patient') {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <h2>Access Denied</h2>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Workout Logs</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          Add Workout Log
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.form}>
            <div className={styles.formHeader}>
              <h2>Add Workout Log</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    exercise_type: 'cardio',
                    duration: '',
                    intensity: 'moderate',
                    calories_burned: '',
                    notes: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="exercise_type">Exercise Type</label>
                  <select
                    id="exercise_type"
                    name="exercise_type"
                    value={formData.exercise_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength Training</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="balance">Balance</option>
                    <option value="sports">Sports</option>
                    <option value="walking">Walking</option>
                    <option value="running">Running</option>
                    <option value="cycling">Cycling</option>
                    <option value="swimming">Swimming</option>
                    <option value="yoga">Yoga</option>
                    <option value="pilates">Pilates</option>
                    <option value="dancing">Dancing</option>
                    <option value="hiking">Hiking</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="duration">Duration (minutes)</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    max="480"
                    required
                    placeholder="e.g., 30"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="intensity">Intensity Level</label>
                  <select
                    id="intensity"
                    name="intensity"
                    value={formData.intensity}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="very_high">Very High</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="calories_burned">Calories Burned</label>
                  <input
                    type="number"
                    id="calories_burned"
                    name="calories_burned"
                    value={formData.calories_burned}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="e.g., 200"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe your workout, how you felt, any challenges or achievements..."
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Workout'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      exercise_type: 'cardio',
                      duration: '',
                      intensity: 'moderate',
                      calories_burned: '',
                      notes: ''
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

      {/* Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Loading workout logs...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Exercise</th>
                <th>Duration</th>
                <th>Intensity</th>
                <th>Calories</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    No workout logs found. Add your first workout!
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.dateTime}>
                        <div className={styles.date}>{formatDate(log.created_at)}</div>
                        <div className={styles.time}>{formatTime(log.created_at)}</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.exerciseInfo}>
                        <span className={styles.exerciseIcon}>
                          {getExerciseIcon(log.exercise_type)}
                        </span>
                        <span className={styles.exerciseType}>
                          {log.exercise_type.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.duration}>
                        {log.duration} min
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.intensity} ${styles[getIntensityColor(log.intensity)]}`}>
                        {log.intensity.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={styles.calories}>
                        {log.calories_burned || 'N/A'} cal
                      </span>
                    </td>
                    <td>
                      {log.notes ? (
                        <span className={styles.notes} title={log.notes}>
                          {log.notes.length > 40 
                            ? `${log.notes.substring(0, 40)}...` 
                            : log.notes
                          }
                        </span>
                      ) : (
                        <span className={styles.noNotes}>-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Workout Summary */}
      {logs.length > 0 && (
        <div className={styles.summarySection}>
          <h3>Workout Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <h4>Total Workouts</h4>
              <div className={styles.summaryValue}>
                <span className={styles.number}>{logs.length}</span>
                <span>sessions</span>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <h4>Total Duration</h4>
              <div className={styles.summaryValue}>
                <span className={styles.number}>
                  {logs.reduce((total, log) => total + (parseInt(log.duration) || 0), 0)}
                </span>
                <span>minutes</span>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <h4>Total Calories</h4>
              <div className={styles.summaryValue}>
                <span className={styles.number}>
                  {logs.reduce((total, log) => total + (parseFloat(log.calories_burned) || 0), 0).toFixed(0)}
                </span>
                <span>burned</span>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <h4>Most Common</h4>
              <div className={styles.summaryValue}>
                {(() => {
                  const exerciseCounts = {};
                  logs.forEach(log => {
                    exerciseCounts[log.exercise_type] = (exerciseCounts[log.exercise_type] || 0) + 1;
                  });
                  const mostCommon = Object.keys(exerciseCounts).reduce((a, b) => 
                    exerciseCounts[a] > exerciseCounts[b] ? a : b
                  );
                  return (
                    <>
                      <span className={styles.exerciseIcon}>{getExerciseIcon(mostCommon)}</span>
                      <span>{mostCommon.replace('_', ' ')}</span>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutLogs;
