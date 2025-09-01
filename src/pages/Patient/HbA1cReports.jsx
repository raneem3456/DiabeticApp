import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { patientAPI } from '../../api/patient';
import { formatDate } from '../../utils/helpers';
import styles from './HbA1cReports.module.css';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'normal', label: 'Normal' },
  { value: 'prediabetes', label: 'Prediabetes' },
  { value: 'diabetes', label: 'Diabetes' },
];

const HbA1cReports = () => {
  const { user } = useAuthStore();
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    hba1c_value: '',
    test_date: '',
    notes: ''
  });
  const [filterStatus, setFilterStatus] = useState('all');

  const { loading, error, callApi } = useApi();

  const fetchReports = async () => {
    const data = await callApi(patientAPI.getHbA1cReports);
    if (data) setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getHbA1cStatus = (value) => {
    const numValue = parseFloat(value);
    if (numValue < 5.7) return 'normal';
    if (numValue < 6.5) return 'prediabetes';
    return 'diabetes';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReport) {
        await callApi(() => patientAPI.updateHbA1cReport(editingReport.id, formData));
      } else {
        await callApi(() => patientAPI.createHbA1cReport(formData));
      }
      resetForm();
      fetchReports();
    } catch (err) {
      console.error('Error saving HbA1c report:', err);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingReport(null);
    setFormData({
      hba1c_value: '',
      test_date: '',
      notes: ''
    });
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      hba1c_value: report.hba1c_value.toString(),
      test_date: report.test_date,
      notes: report.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await callApi(() => patientAPI.deleteHbA1cReport(id));
      fetchReports();
    } catch (err) {
      console.error('Error deleting HbA1c report:', err);
    }
  };

  const handleFilterChange = (e) => setFilterStatus(e.target.value);

  const filteredReports = reports.filter(r => 
    filterStatus === 'all' ? true : getHbA1cStatus(r.hba1c_value) === filterStatus
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>HbA1c Reports</h1>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>Add New Report</button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

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
              <h2>{editingReport ? 'Edit HbA1c Report' : 'Add New HbA1c Report'}</h2>
              <button className={styles.closeButton} onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="hba1c_value">HbA1c Value (%)</label>
                <input
                  type="number"
                  id="hba1c_value"
                  name="hba1c_value"
                  value={formData.hba1c_value}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="20"
                  step="0.1"
                  placeholder="e.g., 6.5"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="test_date">Test Date</label>
                <input type="date" id="test_date" name="test_date" value={formData.test_date} onChange={handleInputChange} required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows="3" placeholder="Any additional notes..." />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? 'Saving...' : (editingReport ? 'Update' : 'Save')}
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
          <div className={styles.loading}>Loading HbA1c reports...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Test Date</th>
                <th>HbA1c Value (%)</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.noData}>No HbA1c reports found for selected filter!</td>
                </tr>
              ) : (
                filteredReports.map(report => {
                  const status = getHbA1cStatus(report.hba1c_value);
                  return (
                    <tr key={report.id} className={styles.tableRow}>
                      <td>{formatDate(report.test_date)}</td>
                      <td><span className={`${styles.hba1cValue} ${styles[status]}`}>{report.hba1c_value}%</span></td>
                      <td><span className={`${styles.status} ${styles[status]}`}>{status}</span></td>
                      <td>
                        {report.notes ? (
                          <span className={styles.notes} title={report.notes}>
                            {report.notes.length > 50 ? `${report.notes.substring(0,50)}...` : report.notes}
                          </span>
                        ) : <span className={styles.noNotes}>-</span>}
                      </td>
                      <td>{formatDate(report.created_at)}</td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.editButton} onClick={() => handleEdit(report)}>Edit</button>
                          <button className={styles.deleteButton} onClick={() => handleDelete(report.id)}>Delete</button>
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

export default HbA1cReports;
