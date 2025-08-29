import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { patientAPI } from '../../api/patient';
import { formatDate } from '../../utils/helpers';
import styles from './HbA1cReports.module.css';

const HbA1cReports = () => {
  const { user } = useAuthStore();
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    hba1c_value: '',
    test_date: '',
    notes: ''
  });

  const { loading, error, callApi } = useApi();

  // Fetch HbA1c reports
  const fetchReports = async () => {
    const data = await callApi(patientAPI.getHbA1cReports);
    if (data) {
      setReports(data);
    }
  };

  useEffect(() => {
    fetchReports();
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
      await callApi(() => patientAPI.createHbA1cReport(formData));
      
      setShowForm(false);
      setFormData({
        hba1c_value: '',
        test_date: '',
        notes: ''
      });
      fetchReports();
    } catch (error) {
      console.error('Error creating HbA1c report:', error);
    }
  };

  // Get HbA1c status
  const getHbA1cStatus = (value) => {
    const numValue = parseFloat(value);
    if (numValue < 5.7) return 'normal';
    if (numValue < 6.5) return 'prediabetes';
    return 'diabetes';
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
        <h1>HbA1c Reports</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          Add New Report
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
              <h2>Add New HbA1c Report</h2>
              <button 
                className={styles.closeButton}
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    hba1c_value: '',
                    test_date: '',
                    notes: ''
                  });
                }}
              >
                ×
              </button>
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
                <input
                  type="date"
                  id="test_date"
                  name="test_date"
                  value={formData.test_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any additional notes about the test..."
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Report'}
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      hba1c_value: '',
                      test_date: '',
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
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.noData}>
                    No HbA1c reports found. Add your first report!
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  const status = getHbA1cStatus(report.hba1c_value);
                  return (
                    <tr key={report.id} className={styles.tableRow}>
                      <td>
                        <span className={styles.testDate}>
                          {formatDate(report.test_date)}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.hba1cValue} ${styles[status]}`}>
                          {report.hba1c_value}%
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.status} ${styles[status]}`}>
                          {status}
                        </span>
                      </td>
                      <td>
                        {report.notes ? (
                          <span className={styles.notes} title={report.notes}>
                            {report.notes.length > 50 
                              ? `${report.notes.substring(0, 50)}...` 
                              : report.notes
                            }
                          </span>
                        ) : (
                          <span className={styles.noNotes}>-</span>
                        )}
                      </td>
                      <td>
                        <span className={styles.createdDate}>
                          {formatDate(report.created_at)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Info Section */}
      <div className={styles.infoSection}>
        <h3>About HbA1c</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h4>Normal</h4>
            <p>&lt; 5.7%</p>
            <span className={styles.normal}>Healthy blood sugar control</span>
          </div>
          <div className={styles.infoCard}>
            <h4>Prediabetes</h4>
            <p>5.7% - 6.4%</p>
            <span className={styles.prediabetes}>Increased risk of diabetes</span>
          </div>
          <div className={styles.infoCard}>
            <h4>Diabetes</h4>
            <p>≥ 6.5%</p>
            <span className={styles.diabetes}>Diabetes diagnosis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HbA1cReports;
