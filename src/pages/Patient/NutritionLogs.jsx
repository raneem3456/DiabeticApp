import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { patientAPI } from '../../api/patient';
import { formatDate, formatTime } from '../../utils/helpers';
import styles from './NutritionLogs.module.css';

const NutritionLogs = () => {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    meal_type: 'breakfast',
    food_items: '',
    calories: '',
    carbohydrates: '',
    protein: '',
    fat: '',
    fiber: '',
    sugar: '',
    sodium: '',
    notes: ''
  });

  const { loading, error, callApi } = useApi();

  // Fetch nutrition logs
  const fetchLogs = async () => {
    const data = await callApi(patientAPI.getNutritionLogs);
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
      await callApi(() => patientAPI.createNutritionLog(formData));
      
      setShowForm(false);
      setFormData({
        meal_type: 'breakfast',
        food_items: '',
        calories: '',
        carbohydrates: '',
        protein: '',
        fat: '',
        fiber: '',
        sugar: '',
        sodium: '',
        notes: ''
      });
      fetchLogs();
    } catch (error) {
      console.error('Error creating nutrition log:', error);
    }
  };

  // Calculate total calories
  const calculateTotalCalories = (log) => {
    return (log.calories || 0) + (log.carbohydrates * 4 || 0) + (log.protein * 4 || 0) + (log.fat * 9 || 0);
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
        <h1>Nutrition Logs</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          Add Nutrition Log
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
              <h2>Add Nutrition Log</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    meal_type: 'breakfast',
                    food_items: '',
                    calories: '',
                    carbohydrates: '',
                    protein: '',
                    fat: '',
                    fiber: '',
                    sugar: '',
                    sodium: '',
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
                  <label htmlFor="meal_type">Meal Type</label>
                  <select
                    id="meal_type"
                    name="meal_type"
                    value={formData.meal_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="calories">Calories</label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="e.g., 250"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="food_items">Food Items</label>
                <textarea
                  id="food_items"
                  name="food_items"
                  value={formData.food_items}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="List the food items you consumed..."
                  required
                />
              </div>

              <div className={styles.nutritionGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="carbohydrates">Carbohydrates (g)</label>
                  <input
                    type="number"
                    id="carbohydrates"
                    name="carbohydrates"
                    value={formData.carbohydrates}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="e.g., 30"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="protein">Protein (g)</label>
                  <input
                    type="number"
                    id="protein"
                    name="protein"
                    value={formData.protein}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="e.g., 15"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="fat">Fat (g)</label>
                  <input
                    type="number"
                    id="fat"
                    name="fat"
                    value={formData.fat}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="e.g., 10"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="fiber">Fiber (g)</label>
                  <input
                    type="number"
                    id="fiber"
                    name="fiber"
                    value={formData.fiber}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="e.g., 5"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="sugar">Sugar (g)</label>
                  <input
                    type="number"
                    id="sugar"
                    name="sugar"
                    value={formData.sugar}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="e.g., 12"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="sodium">Sodium (mg)</label>
                  <input
                    type="number"
                    id="sodium"
                    name="sodium"
                    value={formData.sodium}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    placeholder="e.g., 500"
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
                  rows="2"
                  placeholder="Any additional notes about your meal..."
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Log'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      meal_type: 'breakfast',
                      food_items: '',
                      calories: '',
                      carbohydrates: '',
                      protein: '',
                      fat: '',
                      fiber: '',
                      sugar: '',
                      sodium: '',
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
          <div className={styles.loading}>Loading nutrition logs...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Meal Type</th>
                <th>Food Items</th>
                <th>Calories</th>
                <th>Macros (g)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    No nutrition logs found. Add your first log!
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
                      <span className={`${styles.mealType} ${styles[log.meal_type]}`}>
                        {log.meal_type}
                      </span>
                    </td>
                    <td>
                      <span className={styles.foodItems} title={log.food_items}>
                        {log.food_items.length > 50 
                          ? `${log.food_items.substring(0, 50)}...` 
                          : log.food_items
                        }
                      </span>
                    </td>
                    <td>
                      <span className={styles.calories}>
                        {calculateTotalCalories(log)} cal
                      </span>
                    </td>
                    <td>
                      <div className={styles.macros}>
                        <span className={styles.macro}>C: {log.carbohydrates || 0}g</span>
                        <span className={styles.macro}>P: {log.protein || 0}g</span>
                        <span className={styles.macro}>F: {log.fat || 0}g</span>
                      </div>
                    </td>
                    <td>
                      {log.notes ? (
                        <span className={styles.notes} title={log.notes}>
                          {log.notes.length > 30 
                            ? `${log.notes.substring(0, 30)}...` 
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

      {/* Nutrition Summary */}
      {logs.length > 0 && (
        <div className={styles.summarySection}>
          <h3>Nutrition Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <h4>Total Calories</h4>
              <div className={styles.summaryValue}>
                <span className={styles.number}>
                  {logs.reduce((total, log) => total + calculateTotalCalories(log), 0).toFixed(0)}
                </span>
                <span>calories</span>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <h4>Average per Day</h4>
              <div className={styles.summaryValue}>
                <span className={styles.number}>
                  {(logs.reduce((total, log) => total + calculateTotalCalories(log), 0) / 
                    Math.max(1, new Set(logs.map(log => formatDate(log.created_at))).size)).toFixed(0)}
                </span>
                <span>calories/day</span>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <h4>Total Logs</h4>
              <div className={styles.summaryValue}>
                <span className={styles.number}>{logs.length}</span>
                <span>entries</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionLogs;
