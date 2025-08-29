import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useApi } from '../../hooks/useApi';
import { doctorAPI } from '../../api/doctor';
import { formatDate } from '../../utils/helpers';
import styles from './PatientsOverview.module.css';

const PatientsOverview = () => {
  const { user } = useAuthStore();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, error, callApi } = useApi();

  const fetchPatients = async () => {
    try {
      const data = await callApi(doctorAPI.getPatientOverview);
      setPatients(data.patients || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1>Patients Overview</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={handleInputChange}
            className={styles.searchInput}
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Total Patients</h3>
            <p>{patients.length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>Active Patients</h3>
            <p>{patients.filter(p => p.is_active).length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🩸</div>
          <div className={styles.statContent}>
            <h3>Recent Readings</h3>
            <p>{patients.filter(p => p.last_glucose_reading).length}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📈</div>
          <div className={styles.statContent}>
            <h3>Avg HbA1c</h3>
            <p>7.2%</p>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading patients...</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Diabetes Type</th>
                <th>Last Reading</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className={styles.tableRow}>
                  <td>{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>{patient.age || 'N/A'}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[patient.diabetes_type]}`}>
                      {patient.diabetes_type || 'N/A'}
                    </span>
                  </td>
                  <td>
                    {patient.last_glucose_reading ? (
                      <span className={`${styles.reading} ${styles[patient.last_glucose_reading.status]}`}>
                        {patient.last_glucose_reading.value} mg/dL
                      </span>
                    ) : (
                      'No readings'
                    )}
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[patient.is_active ? 'active' : 'inactive']}`}>
                      {patient.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.viewButton}
                        onClick={() => handlePatientClick(patient)}
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showPatientDetails && selectedPatient && (
        <div className={styles.modalOverlay} onClick={() => setShowPatientDetails(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedPatient.name}</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowPatientDetails(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.patientInfo}>
                <div className={styles.infoSection}>
                  <h3>Personal Information</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label>Email:</label>
                      <span>{selectedPatient.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Age:</label>
                      <span>{selectedPatient.age || 'N/A'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Gender:</label>
                      <span>{selectedPatient.gender || 'N/A'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Phone:</label>
                      <span>{selectedPatient.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3>Health Information</h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label>Diabetes Type:</label>
                      <span className={`${styles.badge} ${styles[selectedPatient.diabetes_type]}`}>
                        {selectedPatient.diabetes_type || 'N/A'}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Weight:</label>
                      <span>{selectedPatient.weight ? `${selectedPatient.weight} kg` : 'N/A'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>Height:</label>
                      <span>{selectedPatient.height ? `${selectedPatient.height} cm` : 'N/A'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <label>BMI:</label>
                      <span>{selectedPatient.bmi || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3>Recent Activity</h3>
                  <div className={styles.activityGrid}>
                    <div className={styles.activityItem}>
                      <label>Last Glucose Reading:</label>
                      <span>
                        {selectedPatient.last_glucose_reading ? (
                          <span className={`${styles.reading} ${styles[selectedPatient.last_glucose_reading.status]}`}>
                            {selectedPatient.last_glucose_reading.value} mg/dL
                            <small> ({formatDate(selectedPatient.last_glucose_reading.created_at)})</small>
                          </span>
                        ) : (
                          'No recent readings'
                        )}
                      </span>
                    </div>
                    <div className={styles.activityItem}>
                      <label>Last HbA1c:</label>
                      <span>
                        {selectedPatient.last_hba1c ? (
                          `${selectedPatient.last_hba1c.value}% (${formatDate(selectedPatient.last_hba1c.test_date)})`
                        ) : (
                          'No recent HbA1c'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsOverview;
