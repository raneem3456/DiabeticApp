import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { doctorAPI } from '../../api/doctor';
import { formatDate } from '../../utils/helpers';
import styles from './Medications.module.css';

const Medications = () => {
  const { user } = useAuthStore();
  const [medications, setMedications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    name: '',
    dosage: '',
    frequency: '',
    route: 'oral',
    instructions: '',
    start_date: '',
    end_date: '',
    is_active: true,
    side_effects: '',
    contraindications: '',
    pharmacy: '',
    prescription_number: ''
  });
  const { loading, error, callApi } = useApi();

  const fetchMedications = async () => {
    try {
      const data = await callApi(doctorAPI.getMedications);
      setMedications(data.medications || []);
    } catch (err) {
      console.error('Error fetching medications:', err);
    }
  };

  useEffect(() => {
    fetchMedications();
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
    try {
      if (editingMedication) {
        // Update medication logic would go here
        console.log('Update medication:', formData);
      } else {
        await callApi(() => doctorAPI.createMedication(formData));
        setShowForm(false);
        setFormData({
          patient_id: '',
          name: '',
          dosage: '',
          frequency: '',
          route: 'oral',
          instructions: '',
          start_date: '',
          end_date: '',
          is_active: true,
          side_effects: '',
          contraindications: '',
          pharmacy: '',
          prescription_number: ''
        });
        fetchMedications();
      }
    } catch (err) {
      console.error('Error saving medication:', err);
    }
  };

  const handleEdit = (medication) => {
    setEditingMedication(medication);
    setFormData({
      patient_id: medication.patient_id || '',
      name: medication.name || '',
      dosage: medication.dosage || '',
      frequency: medication.frequency || '',
      route: medication.route || 'oral',
      instructions: medication.instructions || '',
      start_date: medication.start_date || '',
      end_date: medication.end_date || '',
      is_active: medication.is_active || true,
      side_effects: medication.side_effects || '',
      contraindications: medication.contraindications || '',
      pharmacy: medication.pharmacy || '',
      prescription_number: medication.prescription_number || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        // Delete medication logic would go here
        console.log('Delete medication:', id);
        fetchMedications();
      } catch (err) {
        console.error('Error deleting medication:', err);
      }
    }
  };

  const getStatusColor = (isActive, endDate) => {
    if (!isActive) return 'inactive';
    if (endDate && new Date(endDate) < new Date()) return 'expired';
    return 'active';
  };

  if (user?.role !== 'doctor') {
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
        <h1>Medications Management</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          Add New Medication
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💊</div>
          <div className={styles.statContent}>
            <h3>Total Medications</h3>
            <p>{medications.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3>Active Medications</h3>
            <p>{medications.filter(m => m.is_active).length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statContent}>
            <h3>Expired Medications</h3>
            <p>{medications.filter(m => m.end_date && new Date(m.end_date) < new Date()).length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Patients on Meds</h3>
            <p>{new Set(medications.map(m => m.patient_id)).size}</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingMedication ? 'Edit Medication' : 'Add New Medication'}</h2>
              <button
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setEditingMedication(null);
                  setFormData({
                    patient_id: '',
                    name: '',
                    dosage: '',
                    frequency: '',
                    route: 'oral',
                    instructions: '',
                    start_date: '',
                    end_date: '',
                    is_active: true,
                    side_effects: '',
                    contraindications: '',
                    pharmacy: '',
                    prescription_number: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="patient_id">Patient ID</label>
                  <input
                    type="text"
                    id="patient_id"
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Medication Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="dosage">Dosage</label>
                  <input
                    type="text"
                    id="dosage"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="frequency">Frequency</label>
                  <input
                    type="text"
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="route">Route</label>
                  <select
                    id="route"
                    name="route"
                    value={formData.route}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="oral">Oral</option>
                    <option value="injection">Injection</option>
                    <option value="topical">Topical</option>
                    <option value="inhalation">Inhalation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="start_date">Start Date</label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
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
                <div className={styles.formGroup}>
                  <label htmlFor="pharmacy">Pharmacy</label>
                  <input
                    type="text"
                    id="pharmacy"
                    name="pharmacy"
                    value={formData.pharmacy}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="prescription_number">Prescription Number</label>
                  <input
                    type="text"
                    id="prescription_number"
                    name="prescription_number"
                    value={formData.prescription_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="instructions">Instructions</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="side_effects">Side Effects</label>
                <textarea
                  id="side_effects"
                  name="side_effects"
                  value={formData.side_effects}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="contraindications">Contraindications</label>
                <textarea
                  id="contraindications"
                  name="contraindications"
                  value={formData.contraindications}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  Active Medication
                </label>
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton} disabled={loading}>
                  {loading ? 'Saving...' : (editingMedication ? 'Update' : 'Save')}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setEditingMedication(null);
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
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading medications...</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Route</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((medication) => (
                <tr key={medication.id} className={styles.tableRow}>
                  <td>{medication.patient_id}</td>
                  <td>
                    <div className={styles.medicationInfo}>
                      <strong>{medication.name}</strong>
                      {medication.pharmacy && (
                        <small>Pharmacy: {medication.pharmacy}</small>
                      )}
                    </div>
                  </td>
                  <td>{medication.dosage}</td>
                  <td>{medication.frequency}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[medication.route]}`}>
                      {medication.route}
                    </span>
                  </td>
                  <td>{formatDate(medication.start_date)}</td>
                  <td>{medication.end_date ? formatDate(medication.end_date) : 'Ongoing'}</td>
                  <td>
                    <span className={`${styles.status} ${styles[getStatusColor(medication.is_active, medication.end_date)]}`}>
                      {!medication.is_active ? 'Inactive' : 
                       (medication.end_date && new Date(medication.end_date) < new Date()) ? 'Expired' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEdit(medication)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(medication.id)}
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

export default Medications;
