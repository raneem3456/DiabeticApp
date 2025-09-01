import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { patientAPI } from '../../api/patient';
import { formatDate, formatTime, getGlucoseStatus } from '../../utils/helpers';
import { GLUCOSE_SOURCES } from '../../utils/constants';
import styles from './GlucoseReadings.module.css';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'low', label: 'Low' },
];

const GlucoseReadings = () => {
  const { user } = useAuthStore();
  const [readings, setReadings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const [formData, setFormData] = useState({
    glucose_value: '',
    source: 'finger_prick',
    meal_context: 'before_breakfast',
    notes: ''
  });
  const [filterStatus, setFilterStatus] = useState('all');

  const { loading, error, callApi } = useApi();

  // Fetch readings
  const fetchReadings = async () => {
    const data = await callApi(patientAPI.getGlucoseReadings);
    if (data) setReadings(data);
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReading) {
        await callApi(() => patientAPI.updateGlucoseReading(editingReading.id, formData));
      } else {
        await callApi(() => patientAPI.createGlucoseReading(formData));
      }
      resetForm();
      fetchReadings();
    } catch (err) {
      console.error('Error saving glucose reading:', err);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingReading(null);
    setFormData({
      glucose_value: '',
      source: 'finger_prick',
      meal_context: 'before_breakfast',
      notes: ''
    });
  };

  const handleEdit = (reading) => {
    setEditingReading(reading);
    setFormData({
      glucose_value: reading.glucose_value.toString(),
      source: reading.source,
      meal_context: reading.meal_context,
      notes: reading.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reading?')) return;
    try {
      await callApi(() => patientAPI.deleteGlucoseReading(id));
      fetchReadings();
    } catch (err) {
      console.error('Error deleting glucose reading:', err);
    }
  };

  const handleFilterChange = (e) => setFilterStatus(e.target.value);

  const filteredReadings = readings.filter(r => 
    filterStatus === 'all' ? true : getGlucoseStatus(r.glucose_value) === filterStatus
  );

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

  const average = readings.length
    ? (readings.reduce((sum, r) => sum + r.glucose_value, 0) / readings.length).toFixed(1)
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Glucose Readings</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Reading
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {average && <div className={styles.average}>Average Glucose: {average} mg/dL</div>}

      {/* Filter */}
      <div className={styles.filterContainer}>
        <label htmlFor="statusFilter">Filter by Status: </label>
        <select id="statusFilter" value={filterStatus} onChange={handleFilterChange}>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.form}>
            <div className={styles.formHeader}>
              <h2>{editingReading ? 'Edit Reading' : 'Add New Reading'}</h2>
              <button className={styles.closeButton} onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="glucose_value">Glucose Value (mg/dL)</label>
                <input
                  type="number"
                  id="glucose_value"
                  name="glucose_value"
                  value={formData.glucose_value}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="1000"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="source">Source</label>
                <select id="source" name="source" value={formData.source} onChange={handleInputChange}>
                  {Object.entries(GLUCOSE_SOURCES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="meal_context">Meal Context</label>
                <select id="meal_context" name="meal_context" value={formData.meal_context} onChange={handleInputChange}>
                  {['before_breakfast','after_breakfast','before_lunch','after_lunch','before_dinner','after_dinner','bedtime','other']
                    .map(val => (
                      <option key={val} value={val}>{val.replace('_',' ')}</option>
                    ))
                  }
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows="3" />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? 'Saving...' : (editingReading ? 'Update' : 'Save')}
                </button>
                <button type="button" className={styles.cancelButton} onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Loading glucose readings...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Glucose (mg/dL)</th>
                <th>Status</th>
                <th>Source</th>
                <th>Meal Context</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReadings.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.noData}>
                    No glucose readings found for selected filter!
                  </td>
                </tr>
              ) : (
                filteredReadings.map((reading) => {
                  const status = getGlucoseStatus(reading.glucose_value);
                  return (
                    <tr key={reading.id} className={styles.tableRow}>
                      <td>
                        <div className={styles.dateTime}>
                          <div className={styles.date}>{formatDate(reading.created_at)}</div>
                          <div className={styles.time}>{formatTime(reading.created_at)}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.glucoseValue} ${styles[status]}`}>
                          {reading.glucose_value}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.status} ${styles[status]}`}>{status}</span>
                      </td>
                      <td>{GLUCOSE_SOURCES[reading.source] || reading.source}</td>
                      <td>{reading.meal_context.replace('_', ' ')}</td>
                      <td>
                        {reading.notes ? (
                          <span className={styles.notes} title={reading.notes}>
                            {reading.notes.length > 30 ? `${reading.notes.substring(0,30)}...` : reading.notes}
                          </span>
                        ) : (
                          <span className={styles.noNotes}>-</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.editButton} onClick={() => handleEdit(reading)}>Edit</button>
                          <button className={styles.deleteButton} onClick={() => handleDelete(reading.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GlucoseReadings;
