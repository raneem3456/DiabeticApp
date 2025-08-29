import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { patientAPI } from '../../api/patient';
import { formatDate, formatTime } from '../../utils/helpers';
import { MOOD_LEVELS } from '../../utils/constants';
import styles from './MoodTracking.module.css';

const MoodTracking = () => {
  const { user } = useAuthStore();
  const [moods, setMoods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    mood_level: 'happy',
    notes: ''
  });

  const { loading, error, callApi } = useApi();

  // Fetch mood entries
  const fetchMoods = async () => {
    const data = await callApi(patientAPI.getMoodTracking);
    if (data) {
      setMoods(data);
    }
  };

  useEffect(() => {
    fetchMoods();
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
      await callApi(() => patientAPI.createMoodTracking(formData));
      
      setShowForm(false);
      setFormData({
        mood_level: 'happy',
        notes: ''
      });
      fetchMoods();
    } catch (error) {
      console.error('Error creating mood entry:', error);
    }
  };

  // Get mood emoji
  const getMoodEmoji = (level) => {
    const emojis = {
      very_happy: '😄',
      happy: '🙂',
      neutral: '😐',
      sad: '😔',
      very_sad: '😢',
      anxious: '😰',
      stressed: '😤',
      excited: '🤩',
      calm: '😌',
      angry: '😠'
    };
    return emojis[level] || '😐';
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
        <h1>Mood Tracking</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          Add Mood Entry
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
              <h2>Add Mood Entry</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    mood_level: 'happy',
                    notes: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="mood_level">How are you feeling?</label>
                <div className={styles.moodGrid}>
                  {Object.entries(MOOD_LEVELS).map(([key, label]) => (
                    <label key={key} className={styles.moodOption}>
                      <input
                        type="radio"
                        name="mood_level"
                        value={key}
                        checked={formData.mood_level === key}
                        onChange={handleInputChange}
                        required
                      />
                      <div className={styles.moodCard}>
                        <span className={styles.moodEmoji}>{getMoodEmoji(key)}</span>
                        <span className={styles.moodLabel}>{label}</span>
                      </div>
                    </label>
                  ))}
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
                  placeholder="What's on your mind? Any specific events or thoughts that might be affecting your mood?"
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Mood'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      mood_level: 'happy',
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
          <div className={styles.loading}>Loading mood entries...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Mood</th>
                <th>Level</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {moods.length === 0 ? (
                <tr>
                  <td colSpan="4" className={styles.noData}>
                    No mood entries found. Track your first mood!
                  </td>
                </tr>
              ) : (
                moods.map((mood) => (
                  <tr key={mood.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.dateTime}>
                        <div className={styles.date}>{formatDate(mood.created_at)}</div>
                        <div className={styles.time}>{formatTime(mood.created_at)}</div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.moodDisplay}>
                        <span className={styles.moodEmoji}>{getMoodEmoji(mood.mood_level)}</span>
                        <span className={styles.moodText}>{MOOD_LEVELS[mood.mood_level]}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.moodLevel} ${styles[mood.mood_level]}`}>
                        {mood.mood_level.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {mood.notes ? (
                        <span className={styles.notes} title={mood.notes}>
                          {mood.notes.length > 50 
                            ? `${mood.notes.substring(0, 50)}...` 
                            : mood.notes
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

      {/* Mood Insights */}
      {moods.length > 0 && (
        <div className={styles.insightsSection}>
          <h3>Mood Insights</h3>
          <div className={styles.insightsGrid}>
            <div className={styles.insightCard}>
              <h4>Most Common Mood</h4>
              <div className={styles.insightValue}>
                {(() => {
                  const moodCounts = {};
                  moods.forEach(mood => {
                    moodCounts[mood.mood_level] = (moodCounts[mood.mood_level] || 0) + 1;
                  });
                  const mostCommon = Object.keys(moodCounts).reduce((a, b) => 
                    moodCounts[a] > moodCounts[b] ? a : b
                  );
                  return (
                    <>
                      <span className={styles.moodEmoji}>{getMoodEmoji(mostCommon)}</span>
                      <span>{MOOD_LEVELS[mostCommon]}</span>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className={styles.insightCard}>
              <h4>Total Entries</h4>
              <div className={styles.insightValue}>
                <span className={styles.number}>{moods.length}</span>
                <span>entries</span>
              </div>
            </div>
            <div className={styles.insightCard}>
              <h4>Tracking Streak</h4>
              <div className={styles.insightValue}>
                <span className={styles.number}>
                  {(() => {
                    const sortedMoods = [...moods].sort((a, b) => 
                      new Date(b.created_at) - new Date(a.created_at)
                    );
                    let streak = 0;
                    let currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    
                    for (let i = 0; i < sortedMoods.length; i++) {
                      const moodDate = new Date(sortedMoods[i].created_at);
                      moodDate.setHours(0, 0, 0, 0);
                      
                      if (moodDate.getTime() === currentDate.getTime()) {
                        streak++;
                        currentDate.setDate(currentDate.getDate() - 1);
                      } else if (moodDate.getTime() < currentDate.getTime()) {
                        break;
                      }
                    }
                    return streak;
                  })()}
                </span>
                <span>days</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracking;
